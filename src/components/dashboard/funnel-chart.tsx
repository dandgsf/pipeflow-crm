"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelData } from "@/types/database";

interface FunnelChartProps {
  data: FunnelData[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <Card className="bg-pf-surface border-pf-border">
      <CardHeader>
        <CardTitle className="text-base text-pf-text">Funil de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2A2A2E" />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "#8A8A8F", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="stage_label"
              width={130}
              tick={{ fill: "#8A8A8F", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [value, "Negócios"]}
              labelFormatter={(l) => l}
              contentStyle={{ backgroundColor: "#141416", border: "1px solid #2A2A2E", color: "#E8E8E8", borderRadius: 8 }}
              labelStyle={{ color: "#E8E8E8" }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill="#CAFF33" fillOpacity={0.5 + (0.5 * data.indexOf(entry)) / (data.length || 1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
