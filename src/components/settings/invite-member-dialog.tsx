'use client'

import { useState, useTransition } from 'react'
import { UserPlus } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inviteMemberAction } from '@/lib/actions/workspaces'
import type { MemberRole } from '@/types'

interface InviteMemberDialogProps {
  disabled?: boolean
  disabledReason?: string
}

export function InviteMemberDialog({ disabled, disabledReason }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function resetForm() {
    setEmail('')
    setRole('member')
    setError(null)
    setWarning(null)
    setSuccess(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm()
    setOpen(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Informe o e-mail do convidado.')
      return
    }

    startTransition(async () => {
      const result = await inviteMemberAction(email.trim().toLowerCase(), role)
      if (result?.error) {
        setError(result.error)
      } else {
        if (result?.warning) setWarning(result.warning)
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          resetForm()
        }, result?.warning ? 4000 : 1500)
      }
    })
  }

  return (
    <>
      {/* Trigger externo — base-ui Dialog não usa asChild */}
      <Button
        size="sm"
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        onClick={() => !disabled && setOpen(true)}
        className="gap-1.5 font-semibold"
        style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
      >
        <UserPlus className="h-3.5 w-3.5" />
        Convidar membro
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md"
          style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-[#F0F0F0]">Convidar membro</DialogTitle>
            <DialogDescription className="text-[#888]">
              Um link de convite será enviado por e-mail. Válido por 7 dias.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(202,255,51,0.12)' }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#CAFF33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#F0F0F0]">Convite criado!</p>
              <p className="text-xs text-[#888]">{email}</p>
              {warning && (
                <p className="mt-1 max-w-xs text-center text-xs text-amber-400">{warning}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email" className="text-sm text-[#C8C8C8]">
                  E-mail
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colaborador@empresa.com"
                  disabled={isPending}
                  autoComplete="off"
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#F0F0F0',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invite-role" className="text-sm text-[#C8C8C8]">
                  Papel
                </Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as MemberRole)}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="invite-role"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#F0F0F0',
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <SelectItem value="member">Membro</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
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
                  {isPending ? 'Enviando...' : 'Enviar convite'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
