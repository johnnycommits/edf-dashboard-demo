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

interface TemperatureOverlayChartProps {
  data: Array<{ date: string; therms: number; tempF: number }>;
  height?: number;
}

export function TemperatureOverlayChart({ data, height = 260 }: TemperatureOverlayChartProps) {
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
              tickFormatter={(d) => format(parseISO(d), "MMM d")}
              tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: "#8492A6" }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis yAxisId="therms" orientation="left" stroke="#003189" width={48} tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: "#3D4F6E" }} />
            <YAxis yAxisId="temp" orientation="right" stroke="#FF6600" width={48} tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: "#3D4F6E" }} />
            <Tooltip
              contentStyle={{
                fontFamily: "IBM Plex Mono",
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
              wrapperStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}
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

