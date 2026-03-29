"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { EDF_CHART_COLORS, DEFAULT_CHART_MARGINS } from "@/lib/chart-config";

interface AreaDataPoint {
  date: string;
  value: number;
}

interface UsageAreaChartProps {
  data: AreaDataPoint[];
  height?: number;
  title?: string;
  subtitle?: string;
  yAxisLabel?: string;
  valueFormatter?: (v: number) => string;
  isLoading?: boolean;
}

export function UsageAreaChart({
  data,
  height = 300,
  title,
  subtitle,
  valueFormatter,
  isLoading,
}: UsageAreaChartProps) {
  const isEmpty = !isLoading && (!data || data.length === 0);
  const gradientId = "edfAreaGradient";

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      isEmpty={isEmpty}
      height={height}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={DEFAULT_CHART_MARGINS}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EDF_CHART_COLORS.primary} stopOpacity={0.15} />
              <stop offset="95%" stopColor={EDF_CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            content={<ChartTooltip valueFormatter={valueFormatter} />}
          />
          <Area
            type="monotone"
            dataKey="value"
            name="Value"
            stroke={EDF_CHART_COLORS.primary}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: EDF_CHART_COLORS.primary }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
