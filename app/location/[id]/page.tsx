"use client";

import { useEffect, useMemo, useState } from "react";
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

  // For consistent dataset end date, use last date in dataset (2025-06-30)
  const datasetEnd = "2025-06-30";

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

        // Last 12 months monthly totals from 2024-07 to 2025-06
        const months: string[] = [];
        const startMonth = new Date(2024, 6, 1); // Jul 2024
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

        // Year comparison Jan–Jun 2024 vs Jan–Jun 2025
        const monthsJJ = [1, 2, 3, 4, 5, 6];
        const yc = monthsJJ.map((m) => {
          const mm = String(m).padStart(2, "0");
          const lastYear = allUsageRecords
            .filter((r) => r.locationId === params.id && r.date.startsWith(`2024-${mm}`))
            .reduce((s, r) => s + r.thermsUsed, 0);
          const thisYear = allUsageRecords
            .filter((r) => r.locationId === params.id && r.date.startsWith(`2025-${mm}`))
            .reduce((s, r) => s + r.thermsUsed, 0);
          return { month: `2025-${mm}`, thisYear, lastYear };
        });
        setYearCompare(yc);

        setIsLoading(false);
      } catch (e) {
        setNotFound(true);
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [params.id]);

  const todayLabel = useMemo(() => format(new Date(), "MMM d, yyyy"), []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-edf-light-gray">
        {/* Nav bar */}
        <nav className="h-14 bg-edf-navy flex items-center px-6 justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-xl text-white tracking-tight">EDF</span>
              <span className="text-white/30 mx-2 select-none">|</span>
              <span className="font-mono font-bold text-xl text-edf-orange tracking-tight">Energy</span>
            </div>
            <span className="text-white/60 font-sans text-sm hidden sm:inline">Walmart Energy Portfolio</span>
          </div>
          <span className="font-mono text-sm text-white/75">{todayLabel}</span>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <LocationDetailSkeleton />
        </div>
      </main>
    );
  }

  if (notFound || !location || !summary) {
    return (
      <main className="min-h-screen bg-edf-light-gray">
        <nav className="h-14 bg-edf-navy flex items-center px-6 justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-xl text-white tracking-tight">EDF</span>
              <span className="text-white/30 mx-2 select-none">|</span>
              <span className="font-mono font-bold text-xl text-edf-orange tracking-tight">Energy</span>
            </div>
            <span className="text-white/60 font-sans text-sm hidden sm:inline">Walmart Energy Portfolio</span>
          </div>
          <span className="font-mono text-sm text-white/75">{todayLabel}</span>
        </nav>
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
      <nav className="h-14 bg-edf-navy flex items-center px-6 justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-xl text-white tracking-tight">EDF</span>
            <span className="text-white/30 mx-2 select-none">|</span>
            <span className="font-mono font-bold text-xl text-edf-orange tracking-tight">Energy</span>
          </div>
          <span className="text-white/60 font-sans text-sm hidden sm:inline">Walmart Energy Portfolio</span>
        </div>
        <span className="font-mono text-sm text-white/75">{todayLabel}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <LocationHeader location={location} onBack={() => router.push("/")} />
        <LocationKpiRow summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <UsageAreaChart data={last90Days} />
            <UsageBarChart data={monthlyData} />
            <TemperatureOverlayChart data={overlayData} />
            <MultiLineChart data={yearCompare} />
            <RecentRecordsTable records={recent14} />
          </div>
          <div className="lg:col-span-1">
            <LocationSidebar location={location} />
          </div>
        </div>
      </div>
    </main>
  );
}
