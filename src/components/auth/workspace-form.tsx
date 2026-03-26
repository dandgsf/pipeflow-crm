'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

// ── Schema de validação ────────────────────────────────────────────────────────

const workspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do workspace é obrigatório')
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome pode ter no máximo 50 caracteres'),
})

type WorkspaceValues = z.infer<typeof workspaceSchema>

// ── Componente ─────────────────────────────────────────────────────────────────

export function WorkspaceForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<WorkspaceValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: '' },
  })

  async function onSubmit() {
    setIsLoading(true)
    try {
      // Navegação fake — backend real chega no M7
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-pf-border bg-pf-surface p-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-accent/10 border border-pf-accent/20">
          <Building2 className="h-5 w-5 text-pf-accent" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-pf-text">
            Criar seu workspace
          </h1>
          <p className="mt-1 text-sm text-pf-text-secondary">
            Um workspace é onde você e sua equipe gerenciam leads e negócios.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Nome do workspace */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-pf-text-secondary text-xs font-medium tracking-wide uppercase">
                  Nome da empresa ou equipe
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Acme Corp, Time de Vendas…"
                    autoFocus
                    autoComplete="organization"
                    disabled={isLoading}
                    className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted focus-visible:ring-pf-accent focus-visible:border-pf-accent"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-pf-text-muted">
                  Você poderá alterar isso depois nas configurações.
                </FormDescription>
                <FormMessage className="text-pf-negative text-xs" />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-pf-accent text-pf-bg font-semibold hover:opacity-90 transition-opacity mt-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Criando workspace…' : 'Criar workspace e entrar'}
          </Button>
        </form>
      </Form>

      {/* Indicador de progresso */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="h-1.5 w-6 rounded-full bg-pf-surface-2" />
        <div className="h-1.5 w-6 rounded-full bg-pf-surface-2" />
        <div className="h-1.5 w-6 rounded-full bg-pf-accent" />
      </div>
      <p className="mt-2 text-center text-xs text-pf-text-muted">Passo 3 de 3 — Configuração inicial</p>
    </div>
  )
}
