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
import { useEffect, useState } from "react";

interface PortfolioChartProps {
  data: Array<{ date: string; therms: number | null }>;
  isLoading?: boolean;
}

export function PortfolioChart({ data, isLoading }: PortfolioChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
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

  // Daily within a month: start at 2nd day, end at day before last, then every 4 days
  const n = data.length;
  const step = isMobile ? 8 : 4;
  let tickValues: string[] = [];
  if (n > 3) {
    const firstDate = parseISO(data[0].date);
    const lastDate = parseISO(data[n - 1].date);
    const month = firstDate.getMonth();
    const year = firstDate.getFullYear();
    // Desired endpoints
    const desiredStart = new Date(year, month, isMobile ? 3 : 2); // offset more on mobile
    const desiredEnd = new Date(lastDate.getFullYear(), lastDate.getMonth(), new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0).getDate() - 1); // day before last

    // Find indices in data closest to desiredStart (>=) and desiredEnd (<=)
    const startIdx = Math.max(
      1,
      data.findIndex((d) => parseISO(d.date) >= desiredStart)
    );
    let endIdx = data.length - 2;
    for (let i = n - 1; i >= 0; i--) {
      if (parseISO(data[i].date) <= desiredEnd) {
        endIdx = Math.min(i, n - 2);
        break;
      }
    }
    // Build ticks across the window
    if (startIdx < endIdx) {
      if (isMobile) {
        // Exactly 4 ticks: start, two mids, end
        const total = 4;
        const span = endIdx - startIdx;
        if (span <= 0) {
          tickValues = [data[startIdx].date];
        } else {
          const stepIdx = span / (total - 1);
          tickValues = Array.from({ length: total }, (_, k) => {
            const idx = Math.round(startIdx + k * stepIdx);
            return data[Math.min(endIdx, Math.max(startIdx, idx))].date;
          });
        }
      } else {
        for (let i = startIdx; i <= endIdx; i += step) tickValues.push(data[i].date);
        if (tickValues[tickValues.length - 1] !== data[endIdx].date) tickValues.push(data[endIdx].date);
      }
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">
          This Month&#39;s Portfolio Usage
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
              ticks={tickValues}
              tickFormatter={(d) => format(parseISO(d), "MMM d")}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#8492A6" }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
              }}
              formatter={(v) => [v == null ? "—" : `${Number(v).toLocaleString()} therms`, "Portfolio"]}
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
