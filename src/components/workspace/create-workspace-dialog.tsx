'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createWorkspaceAction } from '@/lib/actions/workspace'

interface CreateWorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  canCreate: boolean
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  canCreate,
}: CreateWorkspaceDialogProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function resetForm() {
    setName('')
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm()
    onOpenChange(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres.')
      return
    }
    if (trimmed.length > 50) {
      setError('O nome deve ter no máximo 50 caracteres.')
      return
    }

    startTransition(async () => {
      const result = await createWorkspaceAction(trimmed)
      if (result?.error) {
        setError(result.error)
      }
      // Em caso de sucesso, createWorkspaceAction redireciona para /dashboard
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {canCreate ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-[#F0F0F0]">
                Criar novo workspace
              </DialogTitle>
              <DialogDescription className="text-[#888]">
                Um workspace é onde você e sua equipe gerenciam leads e negócios.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="workspace-name" className="text-sm text-[#C8C8C8]">
                  Nome do workspace
                </Label>
                <Input
                  id="workspace-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Minha Empresa"
                  disabled={isPending}
                  autoComplete="off"
                  autoFocus
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#F0F0F0',
                  }}
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                  className="text-[#888]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="font-semibold"
                  style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
                >
                  {isPending ? 'Criando...' : 'Criar workspace'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-[#F0F0F0]">
                Limite de workspaces atingido
              </DialogTitle>
              <DialogDescription className="text-[#888]">
                No plano Free você pode ter 1 workspace. Faça upgrade para o plano Pro
                em um dos seus workspaces existentes para criar workspaces adicionais.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/settings/billing"
                onClick={() => handleOpenChange(false)}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
              >
                Fazer upgrade para Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                className="text-[#888]"
              >
                Fechar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
