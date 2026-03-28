'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateWorkspaceAction } from '@/lib/actions/workspaces'
import type { Workspace } from '@/types'

interface WorkspaceSettingsFormProps {
  workspace: Workspace
  isAdmin: boolean
}

export function WorkspaceSettingsForm({ workspace, isAdmin }: WorkspaceSettingsFormProps) {
  const [name, setName] = useState(workspace.name)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateWorkspaceAction(name)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Card: informações do workspace */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h2 className="mb-1 font-display text-base font-semibold text-[#F0F0F0]">
          Informações do Workspace
        </h2>
        <p className="mb-5 text-sm text-[#888]">
          Nome visível para todos os membros da equipe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="workspace-name" className="text-sm text-[#C8C8C8]">
              Nome do workspace
            </Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isAdmin || isPending}
              placeholder="Nome da empresa ou equipe"
              className="max-w-sm"
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#F0F0F0',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[#C8C8C8]">Slug</Label>
            <Input
              value={workspace.slug}
              disabled
              className="max-w-sm font-mono text-sm"
              style={{
                backgroundColor: '#141414',
                borderColor: 'rgba(255,255,255,0.06)',
                color: '#666',
              }}
            />
            <p className="text-xs text-[#555]">O slug não pode ser alterado após a criação.</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[#C8C8C8]">Plano atual</Label>
            <div>
              <span
                className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold"
                style={
                  workspace.plan === 'pro'
                    ? { backgroundColor: 'rgba(202,255,51,0.12)', color: '#CAFF33' }
                    : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#888' }
                }
              >
                {workspace.plan === 'pro' ? 'Pro' : 'Free'}
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm" style={{ color: '#CAFF33' }}>Workspace atualizado!</p>}

          {isAdmin && (
            <Button
              type="submit"
              disabled={isPending || name === workspace.name}
              size="sm"
              className="font-semibold"
              style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
            >
              {isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}
        </form>
      </div>

      {/* Card: apenas leitura para não-admins */}
      {!isAdmin && (
        <p className="text-sm text-[#555]">
          Apenas administradores podem editar as configurações do workspace.
        </p>
      )}
    </div>
  )
}
