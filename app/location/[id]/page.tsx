"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, subDays } from "date-fns";
import {
  getLocationById,
  getLocationSummary,
  getUsageByDateRange,
  allUsageRecords,
  type WalmartLocation,
  type DailyUsageRecord,
  type LocationSummary,
} from "@/lib/data";
import {
  LocationHeader,
  LocationKpiRow,
  UsageAreaChart,
  UsageBarChart,
  TemperatureOverlayChart,
  MultiLineChart,
  RecentRecordsTable,
  LocationSidebar,
  LocationDetailSkeleton,
} from "@/components/location";
import { AppNav } from "@/components/nav";

export default function LocationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [location, setLocation] = useState<WalmartLocation | null>(null);
  const [summary, setSummary] = useState<LocationSummary | null>(null);
  const [last90Days, setLast90Days] = useState<Array<{ date: string; therms: number }>>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; therms: number }>>([]);
  const [overlayData, setOverlayData] = useState<Array<{ date: string; therms: number; tempF: number }>>([]);
  const [recent14, setRecent14] = useState<DailyUsageRecord[]>([]);
  const [yearCompare, setYearCompare] = useState<Array<{ month: string; thisYear: number; lastYear: number }>>([]);

  // For consistent dataset end date, use last date in dataset (2026-03-30)
  const datasetEnd = "2026-03-30";

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const loc = getLocationById(params.id);
        setLocation(loc);

        const sum = getLocationSummary(params.id);
        setSummary(sum);

        const end = parseISO(datasetEnd);
        const d90 = format(subDays(end, 89), "yyyy-MM-dd");
        const d30 = format(subDays(end, 29), "yyyy-MM-dd");
        const d14 = format(subDays(end, 13), "yyyy-MM-dd");

        const rec90 = getUsageByDateRange(params.id, d90, datasetEnd)
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((r) => ({ date: r.date, therms: r.thermsUsed }));
        setLast90Days(rec90);

        // Last 12 months monthly totals Apr 2025 – Mar 2026
        const months: string[] = [];
        const startMonth = new Date(2025, 3, 1); // Apr 2025
        for (let i = 0; i < 12; i++) {
          const d = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          months.push(`${y}-${m}`);
        }
        const monthTotals = months.map((m) => {
          const therms = allUsageRecords
            .filter((r) => r.locationId === params.id && r.date.startsWith(m))
            .reduce((s, r) => s + r.thermsUsed, 0);
          return { month: m, therms };
        });
        setMonthlyData(monthTotals);

        const rec30 = getUsageByDateRange(params.id, d30, datasetEnd)
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((r) => ({ date: r.date, therms: r.thermsUsed, tempF: r.avgTempF }));
        setOverlayData(rec30);

        const rec14 = getUsageByDateRange(params.id, d14, datasetEnd)
          .sort((a, b) => b.date.localeCompare(a.date));
        setRecent14(rec14.slice(0, 14));

        // Compare last 6 months (Oct 2025–Mar 2026) vs prior 6 months (Apr–Sep 2025)
        const monthsThis = [10, 11, 12, 1, 2, 3];
        const monthsPrev = [4, 5, 6, 7, 8, 9];
        const yc = monthsThis.map((m, idx) => {
          const yearThis = m >= 10 ? 2025 : 2026;
          const mmThis = String(m).padStart(2, "0");
          const thisYear = allUsageRecords
            .filter((r) => r.locationId === params.id && r.date.startsWith(`${yearThis}-${mmThis}`))
            .reduce((s, r) => s + r.thermsUsed, 0);
          const mp = monthsPrev[idx];
          const mmPrev = String(mp).padStart(2, "0");
          const lastYear = allUsageRecords
            .filter((r) => r.locationId === params.id && r.date.startsWith(`2025-${mmPrev}`))
            .reduce((s, r) => s + r.thermsUsed, 0);
          return { month: `${yearThis}-${mmThis}`, thisYear, lastYear };
        });
        setYearCompare(yc);

        setIsLoading(false);
      } catch {
        setNotFound(true);
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-edf-light-gray">
        {/* Nav bar */}
        <AppNav />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <LocationDetailSkeleton />
        </div>
      </main>
    );
  }

  if (notFound || !location || !summary) {
    return (
      <main className="min-h-screen bg-edf-light-gray">
        <AppNav />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-8">
          <h1 className="text-xl font-semibold text-edf-dark mb-2">Location not found</h1>
          <button onClick={() => router.push("/")} className="text-edf-navy hover:underline text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-edf-light-gray">
      {/* Nav bar */}
      <AppNav />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <LocationHeader location={location} onBack={() => router.push("/")} />
        <LocationKpiRow summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <UsageAreaChart data={last90Days} />
            <UsageBarChart data={monthlyData} />
            <TemperatureOverlayChart data={overlayData} />
            <MultiLineChart data={yearCompare} />
            <RecentRecordsTable records={recent14} />
          </div>
          <div className="lg:col-span-1 order-1 lg:order-2">
            <LocationSidebar location={location} />
          </div>
        </div>
      </div>
    </main>
  );
}
