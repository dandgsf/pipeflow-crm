'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

interface TooltipPayloadItem {
  payload: {
    label: string
    count: number
    value: number
    color: string
  }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl text-xs space-y-1">
      <p className="font-semibold text-zinc-100">{d.label}</p>
      <p className="text-zinc-400">
        <span className="text-zinc-100 font-mono font-bold">{d.count}</span> negócio{d.count !== 1 ? 's' : ''}
      </p>
      <p className="text-zinc-400">
        Valor: <span className="text-[#CAFF33] font-mono font-bold">{formatCurrency(d.value)}</span>
      </p>
    </div>
  )
}

export interface FunnelDataItem {
  stage: string
  label: string
  count: number
  value: number
  color: string
}

interface FunnelChartProps {
  data: FunnelDataItem[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-full h-64 bg-zinc-800/30 rounded-lg animate-pulse" />
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
          barCategoryGap="20%"
        >
          <XAxis
            dataKey="label"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#52525b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.stage} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
