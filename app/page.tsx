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
  const [portfolioData, setPortfolioData] = useState<Array<{ date: string; therms: number | null }>>([]);
  const [sparklineMap, setSparklineMap] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const s = getAllLocationsSummary();
      setSummaries(s);

      // This month's portfolio usage: sum all locations by date for Mar 2026
      const byDate: Record<string, number> = {};
      allUsageRecords
        .filter((r) => r.date.startsWith("2026-03"))
        .forEach((r) => {
          byDate[r.date] = (byDate[r.date] ?? 0) + r.thermsUsed;
        });
      const mapped: Array<{ date: string; therms: number | null }> = Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, therms]) => ({ date, therms: Math.round(therms) }));
      // Add a placeholder for Mar 31 with null so the line doesn't extend into tomorrow
      mapped.push({ date: "2026-03-31", therms: null });
      setPortfolioData(mapped);

      // 7-day sparklines per location (Mar 24–30, 2026)
      const sMap: Record<string, number[]> = {};
      allUsageRecords
        .filter((r) => r.date >= "2026-03-24" && r.date <= "2026-03-30")
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
    .filter((r) => r.date.startsWith("2026-03"))
    .reduce((s, r) => s + r.costUSD, 0);
  const prevMonthCost = allUsageRecords
    .filter((r) => r.date.startsWith("2026-02"))
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
                  title="Total Cost (Mar)"
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
                  title="Highest Usage This Month"
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
