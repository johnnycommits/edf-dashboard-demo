"use client";

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  unit?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  valueFormatter?: (value: number) => string;
}

export function ChartTooltip({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-edf-dark mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-edf-dark-gray">{entry.name}:</span>
          <span className="font-mono font-medium text-edf-dark">
            {valueFormatter ? valueFormatter(entry.value) : entry.value.toLocaleString()}
            {entry.unit ? ` ${entry.unit}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
