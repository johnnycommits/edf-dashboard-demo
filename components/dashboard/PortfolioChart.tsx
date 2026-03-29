"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface PortfolioChartProps {
  data: Array<{ date: string; therms: number }>;
  isLoading?: boolean;
}

export function PortfolioChart({ data, isLoading }: PortfolioChartProps) {
  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-64 animate-pulse mt-1" />
        </CardHeader>
        <CardContent>
          <div className="h-[220px] bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">
          30-Day Portfolio Usage
        </CardTitle>
        <p className="text-xs text-edf-mid-gray">All 12 locations combined, therms/day</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
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
              interval={4}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
              }}
              formatter={(v) => [`${Number(v).toLocaleString()} therms`, "Portfolio"]}
              labelFormatter={(d) => format(parseISO(d as string), "MMM d, yyyy")}
            />
            <Area
              type="monotone"
              dataKey="therms"
              stroke="#003189"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
