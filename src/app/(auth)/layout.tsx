import type { Metadata } from 'next'
import { Workflow } from 'lucide-react'

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
          <Workflow className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-zinc-900">
          PipeFlow
        </span>
      </div>

      {/* Card de conteúdo */}
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
