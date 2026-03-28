'use client'

import { useTransition } from 'react'
import { Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cancelInviteAction } from '@/lib/actions/workspaces'

interface Invite {
  id: string
  email: string
  role: string
  created_at: string
  expires_at: string
}

interface PendingInviteListProps {
  invites: Invite[]
}

export function PendingInviteList({ invites }: PendingInviteListProps) {
  return (
    <div
      className="divide-y rounded-xl border"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: '#111111',
      }}
    >
      {invites.map((invite) => (
        <InviteRow key={invite.id} invite={invite} />
      ))}
    </div>
  )
}

function InviteRow({ invite }: { invite: Invite }) {
  const [isPending, startTransition] = useTransition()

  const expiresAt = new Date(invite.expires_at)
  const daysLeft = Math.max(
    0,
    Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  function handleCancel() {
    startTransition(async () => {
      await cancelInviteAction(invite.id)
    })
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      {/* Icon */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <Mail className="h-3.5 w-3.5 text-[#666]" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#C8C8C8]">{invite.email}</p>
        <p className="text-xs text-[#666]">
          Expira em {daysLeft} dia{daysLeft !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Role badge */}
      <span
        className="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium"
        style={
          invite.role === 'admin'
            ? { backgroundColor: 'rgba(202,255,51,0.1)', color: '#CAFF33' }
            : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#888' }
        }
      >
        {invite.role === 'admin' ? 'Admin' : 'Membro'}
      </span>

      {/* Cancelar */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-[#666] hover:text-red-400"
        onClick={handleCancel}
        disabled={isPending}
      >
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Cancelar convite</span>
      </Button>
    </div>
  )
}
