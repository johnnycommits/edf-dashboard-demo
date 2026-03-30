"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageBarChartProps {
  data: Array<{ month: string; therms: number }>; // month: '2025-06'
  height?: number;
}

export function UsageBarChart({ data, height = 220 }: UsageBarChartProps) {
  const fmtMonth = (m: string) => {
    const [y, mm] = m.split("-");
    const date = new Date(Number(y), Number(mm) - 1, 1);
    return date.toLocaleString(undefined, { month: "short" });
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">Monthly Usage (Last 12 Months)</CardTitle>
        <p className="text-xs text-edf-mid-gray">One bar per month</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#8492A6" }} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ fontFamily: "var(--font-mono)", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6 }}
              formatter={(v) => [`${Number(v).toLocaleString()} therms`, "Usage"]}
              labelFormatter={(m) => m}
              cursor={{ fill: "#F3F4F6", fillOpacity: 0.6 }}
            />
            <Bar dataKey="therms" fill="#1A4DB5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
