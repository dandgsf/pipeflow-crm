'use client'

import { useState, useEffect } from 'react'

const ACTIVE_WORKSPACE_COOKIE = 'pipeflow_workspace_id'

/**
 * Hook client-side para ler o workspace ativo do cookie.
 * O cookie é definido/atualizado pelo server via lib/workspace.ts.
 * Use este hook em Client Components que precisam do workspaceId.
 */
export function useWorkspace() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${ACTIVE_WORKSPACE_COOKIE}=`))
    const id = match ? decodeURIComponent(match.split('=')[1]) : null
    setWorkspaceId(id)
  }, [])

  return { workspaceId }
}
