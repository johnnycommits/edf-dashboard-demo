"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface UsageAreaChartProps {
  data: Array<{ date: string; therms: number }>;
  height?: number;
}

export function UsageAreaChart({ data, height = 220 }: UsageAreaChartProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">Daily Usage (Last 90 Days)</CardTitle>
        <p className="text-xs text-edf-mid-gray">Therms per day</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="usage90Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003189" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#003189" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(parseISO(d), "MMM d")}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#8492A6" }}
              tickLine={false}
              axisLine={false}
              interval={Math.ceil(data.length / 12)}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ fontFamily: "var(--font-mono)", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6 }}
              formatter={(v) => [`${Number(v).toLocaleString()} therms`, "Usage"]}
              labelFormatter={(d) => format(parseISO(d as string), "MMM d, yyyy")}
            />
            <Area type="monotone" dataKey="therms" stroke="#003189" strokeWidth={2} fill="url(#usage90Gradient)" dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

