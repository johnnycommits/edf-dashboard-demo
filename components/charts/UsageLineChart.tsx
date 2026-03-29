"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { EDF_CHART_COLORS, DEFAULT_CHART_MARGINS } from "@/lib/chart-config";

interface LineDataPoint {
  date: string;
  value: number;
}

interface UsageLineChartProps {
  data: LineDataPoint[];
  height?: number;
  title?: string;
  subtitle?: string;
  yAxisLabel?: string;
  valueFormatter?: (v: number) => string;
  isLoading?: boolean;
}

export function UsageLineChart({
  data,
  height = 300,
  title,
  subtitle,
  valueFormatter,
  isLoading,
}: UsageLineChartProps) {
  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      isEmpty={isEmpty}
      height={height}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={DEFAULT_CHART_MARGINS}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={EDF_CHART_COLORS.grid}
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: EDF_CHART_COLORS.muted }}
            tickLine={false}
            axisLine={{ stroke: EDF_CHART_COLORS.grid }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: EDF_CHART_COLORS.muted }}
            tickLine={false}
            axisLine={false}
            width={45}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={valueFormatter}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Value"
            stroke={EDF_CHART_COLORS.primary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: EDF_CHART_COLORS.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
