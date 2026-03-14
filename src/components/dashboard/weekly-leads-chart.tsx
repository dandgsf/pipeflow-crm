"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyLeadsData } from "@/types/database";

interface WeeklyLeadsChartProps {
  data: WeeklyLeadsData[];
}

export function WeeklyLeadsChart({ data }: WeeklyLeadsChartProps) {
  return (
    <Card className="bg-pf-surface border-pf-border">
      <CardHeader>
        <CardTitle className="text-base text-pf-text">Novos Leads por Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
            <XAxis dataKey="week" tick={{ fill: "#8A8A8F", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#8A8A8F", fontSize: 12 }} />
            <Tooltip
              formatter={(v) => [v, "Leads"]}
              contentStyle={{ backgroundColor: "#141416", border: "1px solid #2A2A2E", color: "#E8E8E8", borderRadius: 8 }}
              labelStyle={{ color: "#E8E8E8" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#CAFF33"
              strokeWidth={2}
              dot={{ r: 4, fill: "#CAFF33" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
