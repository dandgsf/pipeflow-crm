import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  rows?: number
  className?: string
}

/** Skeleton genérico: linhas empilhadas de largura variada */
export function LoadingSkeleton({ rows = 5, className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)} aria-label="Carregando...">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-9 rounded-lg"
          style={{ width: `${85 - (i % 3) * 12}%` }}
        />
      ))}
    </div>
  )
}

/** Skeleton de cards em grid — útil para dashboards */
export function CardGridSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
      aria-label="Carregando..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}
