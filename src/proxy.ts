import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas que exigem autenticação
const PROTECTED_PREFIX = ['/dashboard', '/leads', '/pipeline', '/settings']
// Rotas que usuários autenticados (com sessão) não devem ver
const AUTH_ROUTES = ['/login', '/register']
// Rotas acessíveis apenas por autenticados sem workspace
// (não redireciona para /dashboard automaticamente — o AppLayout faz isso)
const ONBOARDING_ROUTES = ['/onboarding']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualiza a sessão (refresh do token se necessário)
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_PREFIX.some((p) => pathname.startsWith(p))
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p))

  // Usuário não autenticado tentando acessar rota protegida → /login
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado tentando acessar /login ou /register → /dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /onboarding sem sessão → /login
  const isOnboarding = ONBOARDING_ROUTES.some((p) => pathname.startsWith(p))
  if (isOnboarding && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const proxyConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
