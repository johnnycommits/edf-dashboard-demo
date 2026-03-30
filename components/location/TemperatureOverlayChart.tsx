"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

interface TemperatureOverlayChartProps {
  data: Array<{ date: string; therms: number; tempF: number }>;
  height?: number;
}

export function TemperatureOverlayChart({ data, height = 260 }: TemperatureOverlayChartProps) {
  // Adjust tick density for mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  // Daily ticks: start at 2nd day, end at day before last
  // Desktop: every 4 days; Mobile: exactly 3 ticks (start/mid/end)
  const n = data.length;
  const step = 4;
  let tickValues: string[] = [];
  if (n > 3) {
    const first = parseISO(data[0].date);
    const last = parseISO(data[n - 1].date);
    const desiredStart = new Date(first.getFullYear(), first.getMonth(), 2);
    const desiredEnd = new Date(last.getFullYear(), last.getMonth(), new Date(last.getFullYear(), last.getMonth() + 1, 0).getDate() - 1);

    const startIdx = Math.max(1, data.findIndex((d) => parseISO(d.date) >= desiredStart));
    let endIdx = n - 2;
    for (let i = n - 1; i >= 0; i--) {
      if (parseISO(data[i].date) <= desiredEnd) {
        endIdx = Math.min(i, n - 2);
        break;
      }
    }
    if (startIdx < endIdx) {
      if (isMobile) {
        const midIdx = Math.round((startIdx + endIdx) / 2);
        tickValues = [data[startIdx].date, data[midIdx].date, data[endIdx].date];
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
          Usage vs. Temperature (Last 30 Days)
        </CardTitle>
        <p className="text-xs text-edf-mid-gray">
          Correlation between outdoor temperature and natural gas consumption
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
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
            <YAxis yAxisId="therms" orientation="left" stroke="#003189" width={48} tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#3D4F6E" }} />
            <YAxis yAxisId="temp" orientation="right" stroke="#FF6600" width={48} tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#3D4F6E" }} />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
              }}
              labelFormatter={(d) => format(parseISO(d as string), "MMM d, yyyy")}
              formatter={(value, name) => {
                if (name === "therms") return [`${Number(value).toLocaleString()} therms`, "Usage (therms)"];
                if (name === "tempF") return [`${Number(value)} °F`, "Temp (°F)"];
                return [String(value), name as string];
              }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
              formatter={(val) => (val === "therms" ? "Usage (therms)" : val === "tempF" ? "Temp (°F)" : (val as string))}
            />
            <Line
              yAxisId="therms"
              dataKey="therms"
              type="monotone"
              stroke="#003189"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="temp"
              dataKey="tempF"
              type="monotone"
              stroke="#FF6600"
              strokeDasharray="4 2"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
