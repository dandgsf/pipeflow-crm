import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Entrar' }

// LoginForm usa useSearchParams() — Suspense obrigatório no Next.js 14
// para evitar opt-out de static rendering na build.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
