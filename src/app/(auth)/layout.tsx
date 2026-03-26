import type { Metadata } from 'next'
import { Logo } from '@/components/shared/logo'

export const metadata: Metadata = {
  title: {
    default: 'Acesso',
    template: '%s | PipeFlow CRM',
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pf-bg px-4 relative overflow-hidden">
      {/* Orbs decorativos */}
      <div
        className="pf-orb w-[400px] h-[400px] top-[-10%] left-[-5%] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(202,255,51,0.10), transparent 70%)' }}
      />
      <div
        className="pf-orb w-[300px] h-[300px] bottom-[-5%] right-[5%] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(91,127,255,0.10), transparent 70%)', animationDelay: '-5s' }}
      />

      {/* Logo */}
      <div className="mb-8 relative z-10">
        <Logo size="md" />
      </div>

      {/* Conteúdo */}
      <div className="w-full max-w-sm relative z-10">{children}</div>
    </div>
  )
}
