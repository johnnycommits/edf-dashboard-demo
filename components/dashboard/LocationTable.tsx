"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LocationTableRow } from "./LocationTableRow";
import type { LocationSummary } from "@/lib/data";

type SortKey = "therms" | "cost" | "change" | "name";
type SortDir = "asc" | "desc";

interface LocationTableProps {
  summaries: LocationSummary[];
  sparklineMap: Record<string, number[]>;
}

export function LocationTable({ summaries, sparklineMap }: LocationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("therms");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (key !== sortKey) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const sorted = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = summaries.filter(
      (s) =>
        s.location.name.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q)
    );
    return [...filtered].sort((a, b) => {
      let diff = 0;
      if (sortKey === "therms") diff = a.currentMonthUsage - b.currentMonthUsage;
      else if (sortKey === "cost") diff = a.totalCostYTD - b.totalCostYTD;
      else if (sortKey === "change") diff = a.changePercent - b.changePercent;
      else if (sortKey === "name") diff = a.location.name.localeCompare(b.location.name);
      return sortDir === "asc" ? diff : -diff;
    });
  }, [summaries, searchQuery, sortKey, sortDir]);

  const emptyState = (
    <p className="text-center py-10 text-edf-mid-gray text-sm font-sans">
      No locations match your search
    </p>
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search locations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-72 px-3 py-2 text-sm border border-gray-200 rounded-md mb-4 font-sans text-edf-dark placeholder:text-edf-mid-gray focus:outline-none focus:ring-2 focus:ring-edf-navy/20 focus:border-edf-navy bg-white"
      />

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-gray-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-edf-light-gray hover:bg-edf-light-gray border-b border-gray-200">
              <TableHead
                className="text-xs font-semibold text-edf-dark-gray uppercase tracking-wide cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Location{sortIndicator("name")}
              </TableHead>
              <TableHead className="text-xs font-semibold text-edf-dark-gray uppercase tracking-wide">
                7d Trend
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-edf-dark-gray uppercase tracking-wide cursor-pointer select-none"
                onClick={() => handleSort("therms")}
              >
                This Month{sortIndicator("therms")}
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-edf-dark-gray uppercase tracking-wide cursor-pointer select-none"
                onClick={() => handleSort("change")}
              >
                vs Last Mo.{sortIndicator("change")}
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-edf-dark-gray uppercase tracking-wide cursor-pointer select-none"
                onClick={() => handleSort("cost")}
              >
                YTD Cost{sortIndicator("cost")}
              </TableHead>
              <TableHead className="text-xs font-semibold text-edf-dark-gray uppercase tracking-wide">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6}>{emptyState}</td>
              </tr>
            ) : (
              sorted.map((s) => (
                <LocationTableRow
                  key={s.location.id}
                  summary={s}
                  sparklineData={sparklineMap[s.location.id] ?? []}
                  onClick={() => router.push(`/location/${s.location.id}`)}
                  variant="desktop"
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.length === 0
          ? emptyState
          : sorted.map((s) => (
              <LocationTableRow
                key={s.location.id}
                summary={s}
                sparklineData={sparklineMap[s.location.id] ?? []}
                onClick={() => router.push(`/location/${s.location.id}`)}
                variant="mobile"
              />
            ))}
      </div>
    </div>
  );
}
