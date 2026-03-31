'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LeadDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[PipeFlow Lead Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#F0F0F0]">Erro ao carregar lead</h2>
        <p className="max-w-sm text-sm text-[#888]">
          Não foi possível carregar os dados deste lead. Verifique se o link está correto.
        </p>
      </div>
      <div className="mt-2 flex gap-2">
        <Link
          href="/leads"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para Leads
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          className="gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
