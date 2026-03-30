"use client"

import { useEffect, useState } from "react";
import { AppNav } from "@/components/nav";
import { getAllLocationsSummary, allUsageRecords } from "@/lib/data";
import type { LocationSummary } from "@/lib/data";
import {
  KpiCard,
  PortfolioChart,
  LocationTable,
  DashboardSkeleton,
} from "@/components/dashboard";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [summaries, setSummaries] = useState<LocationSummary[]>([]);
  const [portfolioData, setPortfolioData] = useState<Array<{ date: string; therms: number }>>([]);
  const [sparklineMap, setSparklineMap] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const s = getAllLocationsSummary();
      setSummaries(s);

      // 30-day portfolio: sum all locations by date for Jun 2025
      const byDate: Record<string, number> = {};
      allUsageRecords
        .filter((r) => r.date.startsWith("2025-06"))
        .forEach((r) => {
          byDate[r.date] = (byDate[r.date] ?? 0) + r.thermsUsed;
        });
      setPortfolioData(
        Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, therms]) => ({ date, therms: Math.round(therms) }))
      );

      // 7-day sparklines per location (Jun 24–30, 2025)
      const sMap: Record<string, number[]> = {};
      allUsageRecords
        .filter((r) => r.date >= "2025-06-24" && r.date <= "2025-06-30")
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach((r) => {
          if (!sMap[r.locationId]) sMap[r.locationId] = [];
          sMap[r.locationId].push(r.thermsUsed);
        });
      setSparklineMap(sMap);

      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // KPI computations (derived from static data — safe to compute outside useEffect)
  const totalUsage = summaries.reduce((s, l) => s + l.currentMonthUsage, 0);
  const totalPrevUsage = summaries.reduce((s, l) => s + l.previousMonthUsage, 0);
  const portfolioChange =
    totalPrevUsage > 0
      ? parseFloat((((totalUsage - totalPrevUsage) / totalPrevUsage) * 100).toFixed(1))
      : 0;

  const currentMonthCost = allUsageRecords
    .filter((r) => r.date.startsWith("2025-06"))
    .reduce((s, r) => s + r.costUSD, 0);
  const prevMonthCost = allUsageRecords
    .filter((r) => r.date.startsWith("2025-05"))
    .reduce((s, r) => s + r.costUSD, 0);
  const costChange =
    prevMonthCost > 0
      ? parseFloat((((currentMonthCost - prevMonthCost) / prevMonthCost) * 100).toFixed(1))
      : 0;

  const avgUsage = summaries.length > 0 ? Math.round(totalUsage / summaries.length) : 0;

  const highest = summaries.reduce<LocationSummary | null>(
    (max, s) => (!max || s.currentMonthUsage > max.currentMonthUsage ? s : max),
    null
  );

  return (
    <main className="min-h-screen bg-edf-light-gray">
      {/* Nav bar */}
      <AppNav />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* KPI Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  title="Total Portfolio Usage"
                  value={`${totalUsage.toLocaleString()} therms`}
                  change={portfolioChange}
                  changeLabel="vs last month"
                />
                <KpiCard
                  title="Total Cost (Jun)"
                  value={`$${Math.round(currentMonthCost).toLocaleString()}`}
                  change={costChange}
                  changeLabel="vs last month"
                />
                <KpiCard
                  title="Avg Usage / Location"
                  value={`${avgUsage.toLocaleString()} therms`}
                  change={portfolioChange}
                  changeLabel="vs last month"
                />
                <KpiCard
                  title="Highest Consuming"
                  value={
                    highest
                      ? highest.location.city + ", " + highest.location.stateCode
                      : "—"
                  }
                  change={highest?.changePercent ?? 0}
                  changeLabel="this location MoM"
                />
              </div>
            </section>

            {/* Portfolio chart */}
            <section>
              <PortfolioChart data={portfolioData} />
            </section>

            {/* Location table */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-sans font-semibold text-edf-dark">
                  All Locations
                  <span className="ml-2 text-xs font-normal text-edf-mid-gray font-mono">
                    ({summaries.length})
                  </span>
                </h2>
              </div>
              <LocationTable summaries={summaries} sparklineMap={sparklineMap} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
