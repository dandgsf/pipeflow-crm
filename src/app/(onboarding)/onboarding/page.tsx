import type { Metadata } from 'next'
import { Workflow } from 'lucide-react'
import { WorkspaceForm } from '@/components/auth/workspace-form'

export const metadata: Metadata = { title: 'Configurar workspace' }

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
          <Workflow className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-zinc-900">
          PipeFlow
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        {/* Ícone */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <Workflow className="h-6 w-6 text-indigo-600" />
        </div>

        <h1 className="mt-4 text-xl font-semibold text-zinc-900">
          Crie seu workspace
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Um workspace é onde você e sua equipe gerenciam leads e negócios.
          Você pode criar mais depois.
        </p>

        <div className="my-6 border-t border-zinc-100" />

        <WorkspaceForm />
      </div>

      <p className="mt-6 text-xs text-zinc-400">
        Passo 1 de 1 — Configuração inicial
      </p>
    </div>
  )
}
