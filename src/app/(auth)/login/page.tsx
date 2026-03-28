import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Entrar' }

// LoginForm usa useSearchParams() — Suspense obrigatório no Next.js 14
// para evitar opt-out de static rendering na build.
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-[320px] w-full rounded-2xl border border-pf-border bg-pf-surface animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
