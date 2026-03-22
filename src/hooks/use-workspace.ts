'use client'

// Placeholder para M7 (Supabase core)
// Na fase de integração real, este hook lerá o workspace ativo do cookie
// e fornecerá o contexto de workspace para os Client Components.

import { useState, useEffect } from 'react'
import type { Workspace } from '@/types'

const ACTIVE_WORKSPACE_COOKIE = 'pipeflow_workspace_id'

export function useWorkspace() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${ACTIVE_WORKSPACE_COOKIE}=`))
    setWorkspaceId(match ? match.split('=')[1] : null)
  }, [])

  return { workspaceId }
}
