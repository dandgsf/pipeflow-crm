import { redirect } from 'next/navigation'

// /settings → redireciona para a primeira aba
export default function SettingsPage() {
  redirect('/settings/workspace')
}
