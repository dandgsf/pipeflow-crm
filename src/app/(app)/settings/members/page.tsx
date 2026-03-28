import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { getMemberRole } from '@/lib/permissions'
import { MemberList } from '@/components/settings/member-list'
import { PendingInviteList } from '@/components/settings/pending-invite-list'
import { InviteMemberDialog } from '@/components/settings/invite-member-dialog'

export const metadata: Metadata = { title: 'Membros' }

const FREE_MEMBER_LIMIT = 2

export default async function MembersPage() {
  const supabase = await getSupabaseServer()
  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  const role = await getMemberRole(workspace.id)
  const isAdmin = role === 'admin'

  // Buscar membros com dados do usuário (via auth.users via RPC ou join)
  const { data: members } = await supabase
    .from('workspace_members')
    .select('id, workspace_id, user_id, role, created_at')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: true })

  // Buscar emails dos membros via metadata do Supabase
  // Supabase não expõe auth.users diretamente via anon key.
  // Usamos a tabela de perfis ou pegamos o usuário atual para comparação.
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const memberCount = members?.length ?? 0
  const atFreeLimit = workspace.plan === 'free' && memberCount >= FREE_MEMBER_LIMIT

  // Buscar convites pendentes (apenas admins)
  let pendingInvites: Array<{
    id: string
    email: string
    role: string
    created_at: string
    expires_at: string
  }> = []

  if (isAdmin) {
    const { data: invites } = await supabase
      .from('workspace_invites')
      .select('id, email, role, created_at, expires_at')
      .eq('workspace_id', workspace.id)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    pendingInvites = invites ?? []
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-[#F0F0F0]">
            Membros da equipe
          </h2>
          <p className="mt-0.5 text-sm text-[#888]">
            {memberCount} membro{memberCount !== 1 ? 's' : ''}
            {workspace.plan === 'free' && (
              <span className="ml-1 text-[#666]">
                · limite Free: {FREE_MEMBER_LIMIT}
              </span>
            )}
          </p>
        </div>

        {isAdmin && (
          <InviteMemberDialog
            disabled={atFreeLimit}
            disabledReason={
              atFreeLimit
                ? `Limite de ${FREE_MEMBER_LIMIT} membros atingido. Faça upgrade para Pro.`
                : undefined
            }
          />
        )}
      </div>

      {/* Banner de limite */}
      {atFreeLimit && isAdmin && (
        <div
          className="flex items-start gap-3 rounded-lg border p-4"
          style={{
            backgroundColor: 'rgba(202,255,51,0.05)',
            borderColor: 'rgba(202,255,51,0.2)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#CAFF33"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-sm font-medium text-[#CAFF33]">Limite do plano Free atingido</p>
            <p className="mt-0.5 text-xs text-[#888]">
              Faça upgrade para o plano Pro para adicionar membros ilimitados.
            </p>
          </div>
        </div>
      )}

      {/* Lista de membros */}
      <MemberList
        members={members ?? []}
        currentUserId={currentUser?.id ?? ''}
        isAdmin={isAdmin}
      />

      {/* Convites pendentes */}
      {isAdmin && pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#888]">
            Convites pendentes ({pendingInvites.length})
          </h3>
          <PendingInviteList invites={pendingInvites} />
        </div>
      )}
    </div>
  )
}
