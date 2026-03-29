"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_SERIES_COLORS } from "@/lib/chart-config";

interface DonutDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface UsageDonutChartProps {
  data: DonutDataPoint[];
  height?: number;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  valueFormatter?: (v: number) => string;
}

export function UsageDonutChart({
  data,
  height = 300,
  title,
  subtitle,
  isLoading,
  valueFormatter,
}: UsageDonutChartProps) {
  const isEmpty = !isLoading && (!data || data.length === 0);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      isEmpty={isEmpty}
      height={height}
    >
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip valueFormatter={valueFormatter} />}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-edf-dark">
            {valueFormatter ? valueFormatter(total) : total.toLocaleString()}
          </span>
          <span className="text-xs text-edf-mid-gray mt-0.5">Total</span>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
          {data.map((entry, index) => {
            const color = entry.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
            return (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-edf-dark-gray">{entry.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
}
