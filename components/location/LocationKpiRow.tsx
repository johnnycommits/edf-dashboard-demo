"use client";

import { KpiCard } from "@/components/dashboard";
import type { LocationSummary } from "@/lib/data";
import { allUsageRecords } from "@/lib/data";
import { format, parseISO } from "date-fns";

interface LocationKpiRowProps {
  summary: LocationSummary;
  isLoading?: boolean;
}

export function LocationKpiRow({ summary, isLoading }: LocationKpiRowProps) {
  const locationId = summary.location.id;

  // Current and previous month costs (dataset ends 2025-06)
  const currentMonth = "2025-06";
  const prevMonth = "2025-05";
  const currentMonthCost = allUsageRecords
    .filter((r) => r.locationId === locationId && r.date.startsWith(currentMonth))
    .reduce((s, r) => s + r.costUSD, 0);
  const prevMonthCost = allUsageRecords
    .filter((r) => r.locationId === locationId && r.date.startsWith(prevMonth))
    .reduce((s, r) => s + r.costUSD, 0);
  const monthCostChange = prevMonthCost > 0
    ? parseFloat((((currentMonthCost - prevMonthCost) / prevMonthCost) * 100).toFixed(1))
    : 0;

  const peak = summary.peakDay;
  const peakLabel = `${peak.thermsUsed.toLocaleString()} therms on ${format(parseISO(peak.date), "MMM d, yyyy")}`;

  return (
    <section className="mt-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="This Month"
          value={`${summary.currentMonthUsage.toLocaleString()} therms`}
          change={summary.changePercent}
          changeLabel="vs last month"
          isLoading={isLoading}
        />
        <KpiCard
          title="This Month Cost"
          value={`$${Math.round(currentMonthCost).toLocaleString()}`}
          change={monthCostChange}
          changeLabel="vs last month"
          isLoading={isLoading}
        />
        <KpiCard
          title="Peak Day"
          value={peakLabel}
          change={0}
          changeLabel=""
          isLoading={isLoading}
        />
        <KpiCard
          title="YTD Total"
          value={`$${Math.round(summary.totalCostYTD).toLocaleString()}`}
          change={0}
          changeLabel=""
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}

