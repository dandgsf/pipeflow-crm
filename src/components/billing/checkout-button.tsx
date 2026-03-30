'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createCheckoutSessionAction } from '@/lib/actions/billing'

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    try {
      const result = await createCheckoutSessionAction()
      // Se chegou aqui sem redirect, houve erro
      if (result?.error) setError(result.error)
    } catch (err) {
      // redirect() do Next.js lança NEXT_REDIRECT — é o comportamento esperado
      const message = err instanceof Error ? err.message : ''
      if (!message.includes('NEXT_REDIRECT')) {
        setError('Erro ao iniciar checkout. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className="gap-2 bg-[#CAFF33] font-medium text-[#0A0A0A] hover:bg-[#a8d400]"
      >
        <Zap className="h-4 w-4" />
        {loading ? 'Redirecionando...' : 'Assinar Pro — R$49/mês'}
      </Button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
