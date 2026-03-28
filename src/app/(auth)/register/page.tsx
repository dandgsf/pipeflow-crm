import { Suspense } from 'react'
import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = { title: 'Criar conta' }

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-[420px] w-full rounded-2xl border border-pf-border bg-pf-surface animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  )
}
