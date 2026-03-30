"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

interface UsageAreaChartProps {
  data: Array<{ date: string; therms: number }>;
  height?: number;
}

export function UsageAreaChart({ data, height = 220 }: UsageAreaChartProps) {
  // Simple viewport detection to adjust density on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  // 90-day rule: show exactly 10 ticks
  // Start at data index +5 (5 days in) and end at index n-6 (5 days before last)
  // Evenly distribute the remaining ticks between those bounds
  const n = data.length;
  const desiredCount = isMobile ? 5 : 10;
  const tickValues: string[] = [];
  if (n >= 3) {
    const startIdx = Math.min(5, Math.max(1, n - 2));
    const endIdx = Math.max(startIdx + 1, n - 6);
    const span = endIdx - startIdx; // number of index steps available
    const gaps = desiredCount - 1;
    if (span <= 0) {
      // Fallback: just use middle if data is tiny
      tickValues.push(data[Math.floor(n / 2)].date);
    } else {
      const base = Math.floor(span / gaps);
      const extra = span % gaps; // distribute the remainder to the first 'extra' gaps
      let idx = startIdx;
      tickValues.push(data[idx].date);
      for (let g = 1; g <= gaps; g++) {
        const step = base + (g <= extra ? 1 : 0);
        idx += step;
        tickValues.push(data[idx].date);
      }
    }
  }

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
              ticks={tickValues}
              tickFormatter={(d) => format(parseISO(d), "MMM d")}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#8492A6" }}
              tickLine={false}
              axisLine={false}
              interval={0}
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
