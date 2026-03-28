'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'

export function SwitchAccountButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSwitch() {
    setLoading(true)
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = `/login?invite=${token}`
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? 'Saindo…' : 'Entrar com outra conta'}
    </button>
  )
}
