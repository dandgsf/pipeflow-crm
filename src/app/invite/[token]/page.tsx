import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { acceptInviteAction } from '@/lib/actions/workspaces'
import { SwitchAccountButton } from './switch-account-button'

interface InvitePageProps {
  params: Promise<{ token: string }>
}

/**
 * Rota pública: /invite/[token]
 *
 * Fluxo:
 * 1. Usuário não logado → redireciona para /login?invite=[token]
 * 2. Usuário logado com email errado → mostra erro com opção de trocar conta
 * 3. Usuário logado com email correto → aceita convite e redireciona para /dashboard
 */
export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?invite=${token}`)
  }

  const result = await acceptInviteAction(token)

  // Sucesso → acceptInviteAction já fez redirect('/dashboard'), nunca chega aqui
  if (!result?.error) {
    redirect('/dashboard')
  }

  const isWrongEmail = result.error === 'Este convite foi enviado para outro endereço de e-mail.'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
      <div
        className="w-full max-w-md rounded-xl border p-8 text-center"
        style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg font-display text-base font-extrabold"
            style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
          >
            P
          </div>
          <span className="font-display text-base font-semibold text-[#E8E8E8]">PipeFlow</span>
        </div>

        {/* Ícone */}
        <div className="mb-4 flex items-center justify-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255, 71, 87, 0.12)' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF4757"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 font-display text-xl font-bold text-[#F0F0F0]">
          {isWrongEmail ? 'Conta incorreta' : 'Convite inválido'}
        </h1>

        {isWrongEmail ? (
          <>
            <p className="mb-2 text-sm text-[#888]">
              Você está logado com{' '}
              <span className="font-medium text-[#C8C8C8]">{user.email}</span>, mas este convite
              foi enviado para{' '}
              <span className="font-medium text-[#CAFF33]">
                {'expectedEmail' in result ? String(result.expectedEmail) : 'outro e-mail'}
              </span>
              .
            </p>
            <p className="mb-6 text-sm text-[#888]">
              Para aceitar o convite, entre com o e-mail correto.
            </p>
            <div className="flex flex-col gap-3">
              <SwitchAccountButton token={token} />
              <a
                href="/dashboard"
                className="inline-block rounded-lg px-5 py-2.5 text-sm font-medium text-[#888] transition-opacity hover:text-[#F0F0F0]"
              >
                Continuar com conta atual
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-[#888]">{result.error}</p>
            <a
              href="/dashboard"
              className="inline-block rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
            >
              Ir para o Dashboard
            </a>
          </>
        )}
      </div>
    </div>
  )
}
