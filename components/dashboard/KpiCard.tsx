"use client"

import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  isLoading?: boolean;
}

export function KpiCard({ title, value, change, changeLabel, isLoading }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white rounded-xl border-l-[3px] border-l-edf-navy ring-1 ring-black/10 p-5">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  const changeEl =
    change > 0 ? (
      <span className="text-sm font-medium text-edf-danger">▲ +{change.toFixed(1)}%</span>
    ) : change < 0 ? (
      <span className="text-sm font-medium text-edf-success">▼ {change.toFixed(1)}%</span>
    ) : (
      <span className="text-sm text-edf-mid-gray">—</span>
    );

  return (
    <Card className="border-l-[3px] border-l-edf-navy bg-white">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-edf-mid-gray font-sans mb-2">{title}</p>
        <p className="text-2xl font-mono font-semibold text-edf-dark leading-tight">{value}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {changeEl}
          <span className="text-xs text-edf-mid-gray">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
