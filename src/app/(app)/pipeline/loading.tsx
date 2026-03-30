import { Skeleton } from '@/components/ui/skeleton'

export default function PipelineLoading() {
  return (
    <div className="flex h-full flex-col gap-6">
      {/* Page header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <Skeleton className="h-px w-full" />
      </div>

      {/* Kanban columns */}
      <div className="flex flex-1 gap-3 overflow-x-auto pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[272px] flex-none space-y-2">
            <Skeleton className="h-20 rounded-t-lg" />
            <div className="space-y-2 px-1">
              {Array.from({ length: 2 + (i % 3) }).map((_, j) => (
                <Skeleton key={j} className="h-28 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
