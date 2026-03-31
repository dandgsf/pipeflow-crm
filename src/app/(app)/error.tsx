'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[PipeFlow Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#F0F0F0]">Algo deu errado</h2>
        <p className="max-w-sm text-sm text-[#888]">
          Ocorreu um erro inesperado. Tente recarregar a página.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={reset}
        className="mt-2 gap-1.5"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Tentar novamente
      </Button>
    </div>
  )
}
