import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Configurar workspace',
    template: '%s | PipeFlow CRM',
  },
}

// Layout isolado para o onboarding — sem sidebar, sem navbar.
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
