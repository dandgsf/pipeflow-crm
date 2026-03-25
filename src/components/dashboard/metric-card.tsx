import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string
  growth: number
  icon: LucideIcon
  iconColor?: string
}

export function MetricCard({ label, value, growth, icon: Icon, iconColor = 'text-[#CAFF33]' }: MetricCardProps) {
  const isPositive = growth >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold font-mono text-zinc-100">{value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-zinc-800 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <TrendIcon
            className={`h-3.5 w-3.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
          />
          <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{growth}%
          </span>
          <span className="text-xs text-zinc-600">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  )
}
