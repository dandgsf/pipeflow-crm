import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="space-y-1 text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">Página não encontrada</p>
      </div>

      {/* Link estilizado como botão — sem importar buttonVariants de módulo client */}
      <Link
        href="/dashboard"
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  )
}
