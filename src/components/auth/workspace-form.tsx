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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome do workspace */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700">
                Nome da empresa ou equipe
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Ex: Acme Corp, Time de Vendas..."
                    className="pl-9"
                    autoFocus
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-zinc-500">
                Você poderá alterar isso depois nas configurações.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Criando workspace…' : 'Criar workspace e entrar'}
        </Button>
      </form>
    </Form>
  )
}
