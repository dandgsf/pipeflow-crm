'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createPortalSessionAction } from '@/lib/actions/billing'

export function PortalButton() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)

    try {
      await createPortalSessionAction()
    } catch (err) {
      // redirect() do Next.js lança NEXT_REDIRECT — comportamento esperado
      const message = err instanceof Error ? err.message : ''
      if (!message.includes('NEXT_REDIRECT')) {
        console.error('[portal] Erro ao abrir portal:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handlePortal}
      disabled={loading}
      className="gap-2 border-[rgba(255,255,255,0.08)] text-[#F0F0F0] hover:bg-[#1a1a1a]"
    >
      <Settings className="h-4 w-4" />
      {loading ? 'Redirecionando...' : 'Gerenciar Assinatura'}
    </Button>
  )
}
