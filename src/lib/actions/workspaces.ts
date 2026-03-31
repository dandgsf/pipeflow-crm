'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getResend } from '@/lib/resend'
import { isAdmin } from '@/lib/permissions'
import { getActiveWorkspace } from '@/lib/workspace'
import { canAddMember } from '@/lib/limits'
import { renderWorkspaceInviteEmail } from '@/emails/workspace-invite'
import type { MemberRole } from '@/types'

const idSchema = z.string().uuid()
const roleSchema = z.enum(['admin', 'member'])
const tokenSchema = z.string().min(1).max(128)

// ─── Atualizar workspace ──────────────────────────────────────────────────────

export async function updateWorkspaceAction(name: string) {
  const parsed = z.string().min(2).max(100).safeParse(name)
  if (!parsed.success) return { error: 'Nome inválido.' }

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Workspace não encontrado.' }

  if (!(await isAdmin(workspace.id))) {
    return { error: 'Apenas admins podem editar o workspace.' }
  }

  const trimmedName = name.trim()
  if (!trimmedName || trimmedName.length < 2) {
    return { error: 'O nome deve ter ao menos 2 caracteres.' }
  }

  const { error } = await supabase
    .from('workspaces')
    .update({ name: trimmedName })
    .eq('id', workspace.id)

  if (error) return { error: 'Não foi possível atualizar o workspace.' }

  revalidatePath('/settings/workspace')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ─── Convidar membro ──────────────────────────────────────────────────────────

export async function inviteMemberAction(email: string, role: MemberRole) {
  const parsedEmail = z.string().email().max(320).safeParse(email)
  const parsedRole = roleSchema.safeParse(role)
  if (!parsedEmail.success || !parsedRole.success) return { error: 'Dados inválidos.' }

  const supabase = await getSupabaseServer()
  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Workspace não encontrado.' }

  if (!(await isAdmin(workspace.id))) {
    return { error: 'Apenas admins podem convidar membros.' }
  }

  const normalizedEmail = email.trim().toLowerCase()

  // Verificar limite do plano
  const { allowed, current, limit } = await canAddMember()
  if (!allowed) {
    return {
      error: `Limite de ${limit} membros atingido (${current}/${limit}). Faça upgrade para o plano Pro.`,
    }
  }

  // Verificar se já existe convite pendente para este email
  const { data: pendingInvite } = await supabase
    .from('workspace_invites')
    .select('id')
    .eq('workspace_id', workspace.id)
    .eq('email', normalizedEmail)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (pendingInvite) {
    return { error: 'Já existe um convite pendente para este e-mail.' }
  }

  // Buscar dados do usuário que está convidando
  const { data: { user: inviter } } = await supabase.auth.getUser()
  if (!inviter) redirect('/login')

  // Criar convite
  const { data: invite, error: insertError } = await supabase
    .from('workspace_invites')
    .insert({
      workspace_id: workspace.id,
      email: normalizedEmail,
      role,
      invited_by: inviter.id,
    })
    .select('token')
    .single()

  if (insertError || !invite) {
    return { error: 'Não foi possível criar o convite.' }
  }

  // Montar URL de aceite
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const acceptUrl = `${appUrl}/invite/${invite.token}`

  // Renderizar template HTML (string pura, sem react-dom/server)
  const html = renderWorkspaceInviteEmail({
    workspaceName: workspace.name,
    inviterEmail: inviter.email ?? 'alguém',
    role,
    acceptUrl,
  })

  // Enviar email
  try {
    const resend = getResend()
    const { error: emailError } = await resend.emails.send({
      from: 'PipeFlow <noreply@marktracking.com.br>',
      to: normalizedEmail,
      subject: `Você foi convidado para ${workspace.name} no PipeFlow`,
      html,
    })

    if (emailError) {
      console.error('[inviteMember] falha ao enviar email:', emailError)
      revalidatePath('/settings/members')
      return {
        success: true,
        warning: 'Convite criado, mas não foi possível enviar o e-mail. Compartilhe o link manualmente.',
      }
    }
  } catch (err) {
    console.error('[inviteMember] exceção ao enviar email:', err)
    revalidatePath('/settings/members')
    return {
      success: true,
      warning: 'Convite criado, mas não foi possível enviar o e-mail. Compartilhe o link manualmente.',
    }
  }

  revalidatePath('/settings/members')
  return { success: true }
}

// ─── Aceitar convite ──────────────────────────────────────────────────────────

export async function acceptInviteAction(token: string) {
  const parsedToken = tokenSchema.safeParse(token)
  if (!parsedToken.success) return { error: 'Token inválido.' }

  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // Salvar token na URL e redirecionar para login
    redirect(`/login?invite=${token}`)
  }

  // Buscar convite pelo token
  const { data: invite, error: fetchError } = await supabase
    .from('workspace_invites')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .single()

  if (fetchError || !invite) {
    return { error: 'Convite inválido ou já utilizado.' }
  }

  // Verificar expiração
  if (new Date(invite.expires_at) < new Date()) {
    return { error: 'Este convite expirou.' }
  }

  // Verificar se e-mail bate (segurança)
  if (invite.email !== user.email?.toLowerCase()) {
    return {
      error: 'Este convite foi enviado para outro endereço de e-mail.',
    }
  }

  // Verificar se já é membro
  const { data: alreadyMember } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', invite.workspace_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (alreadyMember) {
    // Já é membro — marcar convite como aceito e redirecionar
    await supabase
      .from('workspace_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id)

    redirect('/dashboard')
  }

  // Inserir como membro
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: invite.workspace_id,
      user_id: user.id,
      role: invite.role,
    })

  if (memberError) {
    return { error: 'Não foi possível aceitar o convite. Tente novamente.' }
  }

  // Marcar convite como aceito
  await supabase
    .from('workspace_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  redirect('/dashboard')
}

// ─── Remover membro ───────────────────────────────────────────────────────────

export async function removeMemberAction(memberId: string) {
  const parsedId = idSchema.safeParse(memberId)
  if (!parsedId.success) return { error: 'ID inválido.' }

  const supabase = await getSupabaseServer()
  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Workspace não encontrado.' }

  if (!(await isAdmin(workspace.id))) {
    return { error: 'Apenas admins podem remover membros.' }
  }

  // Não permitir remover a si mesmo
  const { data: { user } } = await supabase.auth.getUser()
  const { data: target } = await supabase
    .from('workspace_members')
    .select('user_id, role')
    .eq('id', memberId)
    .eq('workspace_id', workspace.id)
    .single()

  if (!target) return { error: 'Membro não encontrado.' }
  if (target.user_id === user?.id) return { error: 'Você não pode remover a si mesmo.' }

  // Verificar se é o único admin
  if (target.role === 'admin') {
    const { count } = await supabase
      .from('workspace_members')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
      .eq('role', 'admin')

    if ((count ?? 0) <= 1) {
      return { error: 'O workspace precisa ter ao menos um admin.' }
    }
  }

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('id', memberId)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Não foi possível remover o membro.' }

  revalidatePath('/settings/members')
  return { success: true }
}

// ─── Atualizar role de membro ─────────────────────────────────────────────────

export async function updateMemberRoleAction(memberId: string, role: MemberRole) {
  const parsedId = idSchema.safeParse(memberId)
  const parsedRole = roleSchema.safeParse(role)
  if (!parsedId.success || !parsedRole.success) return { error: 'Dados inválidos.' }

  const supabase = await getSupabaseServer()
  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Workspace não encontrado.' }

  if (!(await isAdmin(workspace.id))) {
    return { error: 'Apenas admins podem alterar roles.' }
  }

  // Não pode rebaixar o único admin
  if (role === 'member') {
    const { data: target } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('id', memberId)
      .eq('workspace_id', workspace.id)
      .single()

    if (target?.role === 'admin') {
      const { count } = await supabase
        .from('workspace_members')
        .select('id', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id)
        .eq('role', 'admin')

      if ((count ?? 0) <= 1) {
        return { error: 'O workspace precisa ter ao menos um admin.' }
      }
    }
  }

  const { error } = await supabase
    .from('workspace_members')
    .update({ role })
    .eq('id', memberId)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Não foi possível atualizar o papel do membro.' }

  revalidatePath('/settings/members')
  return { success: true }
}

// ─── Cancelar convite pendente ────────────────────────────────────────────────

export async function cancelInviteAction(inviteId: string) {
  const parsedId = idSchema.safeParse(inviteId)
  if (!parsedId.success) return { error: 'ID inválido.' }

  const supabase = await getSupabaseServer()
  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Workspace não encontrado.' }

  if (!(await isAdmin(workspace.id))) {
    return { error: 'Apenas admins podem cancelar convites.' }
  }

  const { error } = await supabase
    .from('workspace_invites')
    .delete()
    .eq('id', inviteId)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Não foi possível cancelar o convite.' }

  revalidatePath('/settings/members')
  return { success: true }
}
