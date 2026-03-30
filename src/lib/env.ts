import 'server-only'

/**
 * Validates that all required environment variables are set.
 * Call at server startup to fail fast on misconfiguration.
 */

const requiredServerVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_PRICE_ID',
  'RESEND_API_KEY',
] as const

const requiredPublicVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const key of requiredServerVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  for (const key of requiredPublicVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  // Deduplicate (some vars appear in both lists)
  const unique = [...new Set(missing)]

  if (unique.length > 0) {
    throw new Error(
      `[PipeFlow] Missing required environment variables:\n${unique.map((k) => `  - ${k}`).join('\n')}\n\nCheck your .env.local file or Vercel environment settings.`
    )
  }
}
