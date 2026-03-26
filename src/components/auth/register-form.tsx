'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// ── Schema de validação ────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'E-mail é obrigatório')
      .email('Digite um e-mail válido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

// ── Componente ─────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit() {
    setIsLoading(true)
    try {
      // Dados coletados para cadastro — integração Supabase chega no M7
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.push('/onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-pf-border bg-pf-surface p-8">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-pf-text">
          Criar conta
        </h1>
        <p className="mt-1 text-sm text-pf-text-secondary">
          Comece grátis, sem cartão de crédito
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-pf-text-secondary text-xs font-medium tracking-wide uppercase">
                  Nome completo
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="João Silva"
                    autoComplete="name"
                    disabled={isLoading}
                    className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted focus-visible:ring-pf-accent focus-visible:border-pf-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-pf-negative text-xs" />
              </FormItem>
            )}
          />

          {/* E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-pf-text-secondary text-xs font-medium tracking-wide uppercase">
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="voce@empresa.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted focus-visible:ring-pf-accent focus-visible:border-pf-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-pf-negative text-xs" />
              </FormItem>
            )}
          />

          {/* Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-pf-text-secondary text-xs font-medium tracking-wide uppercase">
                  Senha
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted focus-visible:ring-pf-accent focus-visible:border-pf-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-pf-negative text-xs" />
              </FormItem>
            )}
          />

          {/* Confirmar senha */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-pf-text-secondary text-xs font-medium tracking-wide uppercase">
                  Confirmar senha
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="bg-pf-surface-2 border-pf-border text-pf-text placeholder:text-pf-text-muted focus-visible:ring-pf-accent focus-visible:border-pf-accent"
                    {...field}
                  />
                </FormControl>
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
            {isLoading ? 'Criando conta…' : 'Criar conta grátis'}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-pf-text-muted">
        Já tem uma conta?{' '}
        <Link
          href="/login"
          className="font-medium text-pf-accent hover:opacity-80 transition-opacity"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
