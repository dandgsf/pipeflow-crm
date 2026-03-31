'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase/client'
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
      .min(8, 'A senha deve ter pelo menos 8 caracteres'),
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
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true)
    setAuthError(null)
    try {
      const supabase = getSupabaseClient()
      const inviteToken = searchParams.get('invite')
      const next = inviteToken ? `/invite/${inviteToken}` : '/onboarding'

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setAuthError('Este e-mail já está cadastrado. Tente fazer login.')
        } else {
          setAuthError('Erro ao criar conta. Tente novamente.')
        }
        return
      }

      setEmailSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendEmail() {
    setResending(true)
    setResendSuccess(false)
    try {
      const supabase = getSupabaseClient()
      const inviteToken = searchParams.get('invite')
      const next = inviteToken ? `/invite/${inviteToken}` : '/onboarding'

      await supabase.auth.resend({
        type: 'signup',
        email: form.getValues('email'),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        },
      })
      setResendSuccess(true)
    } finally {
      setResending(false)
    }
  }

  if (emailSent) {
    return (
      <div className="rounded-2xl border border-pf-border bg-pf-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pf-accent/10 border border-pf-accent/20">
          <span className="text-2xl">✉️</span>
        </div>
        <h2 className="font-display text-xl font-semibold text-pf-text">
          Verifique seu e-mail
        </h2>
        <p className="mt-2 text-sm text-pf-text-muted">
          Enviamos um link de confirmação para <strong className="text-pf-text">{form.getValues('email')}</strong>.
          Clique no link para ativar sua conta e continuar.
        </p>
        <p className="mt-4 text-xs text-pf-text-muted">
          {resendSuccess ? (
            <span className="text-pf-accent">E-mail reenviado com sucesso!</span>
          ) : (
            <>
              Não recebeu?{' '}
              <button
                type="button"
                className="text-pf-accent hover:opacity-80 transition-opacity disabled:opacity-50"
                onClick={handleResendEmail}
                disabled={resending}
              >
                {resending ? 'Reenviando…' : 'Reenviar e-mail'}
              </button>
            </>
          )}
        </p>
      </div>
    )
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
          {authError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {authError}
            </div>
          )}
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
                    placeholder="Mínimo 8 caracteres"
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
          href={searchParams.get('invite') ? `/login?invite=${searchParams.get('invite')}` : '/login'}
          className="font-medium text-pf-accent hover:opacity-80 transition-opacity"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
