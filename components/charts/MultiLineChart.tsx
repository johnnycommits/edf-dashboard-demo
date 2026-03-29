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
import { CHART_SERIES_COLORS, EDF_CHART_COLORS, DEFAULT_CHART_MARGINS } from "@/lib/chart-config";

interface MultiLineDataPoint {
  date: string;
  [key: string]: number | string;
}

interface LineConfig {
  key: string;
  label: string;
  color?: string;
}

interface MultiLineChartProps {
  data: MultiLineDataPoint[];
  lines: LineConfig[];
  height?: number;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  valueFormatter?: (v: number) => string;
}

function ChartLegend({ lines }: { lines: LineConfig[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {lines.map((line, index) => {
        const color = line.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
        return (
          <div key={line.key} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-edf-dark-gray">{line.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function MultiLineChart({
  data,
  lines,
  height = 300,
  title,
  subtitle,
  isLoading,
  valueFormatter,
}: MultiLineChartProps) {
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
            content={<ChartTooltip valueFormatter={valueFormatter} />}
          />
          {lines.map((line, index) => {
            const color = line.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
            return (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <ChartLegend lines={lines} />
    </ChartCard>
  );
}
