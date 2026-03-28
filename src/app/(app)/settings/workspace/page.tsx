import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getActiveWorkspace } from '@/lib/workspace'
import { getMemberRole } from '@/lib/permissions'
import { WorkspaceSettingsForm } from '@/components/settings/workspace-settings-form'

export const metadata: Metadata = { title: 'Configurações do Workspace' }

export default async function WorkspaceSettingsPage() {
  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  const role = await getMemberRole(workspace.id)
  const admin = role === 'admin'

  return (
    <div className="max-w-2xl space-y-6">
      <WorkspaceSettingsForm workspace={workspace} isAdmin={admin} />
    </div>
  )
}
