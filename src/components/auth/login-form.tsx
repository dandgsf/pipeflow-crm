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

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginValues = z.infer<typeof loginSchema>

// ── Componente ─────────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
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
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Entrar na conta</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bem-vindo de volta ao PipeFlow
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700">E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="voce@empresa.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-zinc-700">Senha</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-600 hover:underline"
                    tabIndex={-1}
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
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
            {isLoading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Não tem uma conta?{' '}
        <Link
          href="/register"
          className="font-medium text-indigo-600 hover:underline"
        >
          Criar conta grátis
        </Link>
      </p>
    </div>
  )
}
