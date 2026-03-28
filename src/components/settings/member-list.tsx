'use client'

import { useTransition } from 'react'
import { MoreHorizontal, Shield, User, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { removeMemberAction, updateMemberRoleAction } from '@/lib/actions/workspaces'
import type { MemberRole } from '@/types'

interface Member {
  id: string
  workspace_id: string
  user_id: string
  role: string
  created_at: string
}

interface MemberListProps {
  members: Member[]
  currentUserId: string
  isAdmin: boolean
}

export function MemberList({ members, currentUserId, isAdmin }: MemberListProps) {
  if (members.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[#666]">
        Nenhum membro encontrado.
      </p>
    )
  }

  return (
    <div
      className="divide-y rounded-xl border"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: '#111111',
      }}
    >
      {members.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          isCurrentUser={member.user_id === currentUserId}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )
}

function MemberRow({
  member,
  isCurrentUser,
  isAdmin,
}: {
  member: Member
  isCurrentUser: boolean
  isAdmin: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const isAdminRole = member.role === 'admin'

  // Gera iniciais e cor do avatar a partir do user_id
  const avatarColor = getUserColor(member.user_id)
  const initial = member.user_id.slice(0, 1).toUpperCase()

  function handleRoleChange(newRole: MemberRole) {
    startTransition(async () => {
      await updateMemberRoleAction(member.id, newRole)
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await removeMemberAction(member.id)
    })
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      {/* Avatar */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        style={{ backgroundColor: avatarColor, color: '#0C0C0E' }}
      >
        {initial}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#E8E8E8]">
          {member.user_id.slice(0, 8)}...
          {isCurrentUser && (
            <span className="ml-1.5 text-xs text-[#666]">(você)</span>
          )}
        </p>
        <p className="text-xs text-[#666]">
          Desde {new Date(member.created_at).toLocaleDateString('pt-BR', {
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Role badge */}
      <span
        className="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium"
        style={
          isAdminRole
            ? { backgroundColor: 'rgba(202,255,51,0.1)', color: '#CAFF33' }
            : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#888' }
        }
      >
        {isAdminRole ? 'Admin' : 'Membro'}
      </span>

      {/* Ações (apenas admin, não pode agir sobre si mesmo) */}
      {isAdmin && !isCurrentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isPending}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#666] transition-colors hover:bg-white/5 hover:text-[#C8C8C8] disabled:opacity-50"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações do membro</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44"
            style={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            {isAdminRole ? (
              <DropdownMenuItem
                onClick={() => handleRoleChange('member')}
                className="gap-2 text-sm text-[#C8C8C8]"
              >
                <User className="h-3.5 w-3.5" />
                Tornar Membro
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleRoleChange('admin')}
                className="gap-2 text-sm text-[#C8C8C8]"
              >
                <Shield className="h-3.5 w-3.5" />
                Tornar Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <DropdownMenuItem
              onClick={handleRemove}
              className="gap-2 text-sm text-red-400 focus:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

// Gera uma cor determinística a partir do user_id
function getUserColor(userId: string): string {
  const colors = [
    '#CAFF33', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  ]
  const index = userId.charCodeAt(0) % colors.length
  return colors[index]
}
