"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { EDF_CHART_COLORS, DEFAULT_CHART_MARGINS } from "@/lib/chart-config";

interface BarDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface UsageBarChartProps {
  data: BarDataPoint[];
  height?: number;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  valueFormatter?: (v: number) => string;
}

export function UsageBarChart({
  data,
  height = 300,
  title,
  subtitle,
  isLoading,
  valueFormatter,
}: UsageBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
        <BarChart data={data} margin={DEFAULT_CHART_MARGINS}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={EDF_CHART_COLORS.grid}
            strokeOpacity={0.5}
            vertical={false}
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
            cursor={{ fill: 'rgba(0,49,137,0.05)' }}
          />
          <Bar
            dataKey="value"
            name="Value"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? EDF_CHART_COLORS.secondary : EDF_CHART_COLORS.primary}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
