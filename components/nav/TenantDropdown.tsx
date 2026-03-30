"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { allUsageRecords, walmartLocations } from "@/lib/data";

type Props = { variant?: "desktop" | "mobile"; className?: string };

export function TenantDropdown({ variant = "desktop", className }: Props) {
  const [open, setOpen] = useState(false);
  const [showing, setShowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const stats = useMemo(() => {
    // Aggregate this month's usage & cost across portfolio
    const usage = allUsageRecords
      .filter((r) => r.date.startsWith("2026-03"))
      .reduce(
        (acc, r) => {
          acc.therms += r.thermsUsed;
          acc.cost += r.costUSD;
          return acc;
        },
        { therms: 0, cost: 0 }
      );
    return {
      monthTherms: Math.round(usage.therms),
      monthCost: Math.round(usage.cost),
      locations: walmartLocations.length,
    };
  }, []);

  function openPanel() {
    setOpen(true);
    requestAnimationFrame(() => setShowing(true));
  }

  function closePanel() {
    setShowing(false);
    setOpen(false);
  }

  const wrapperVisibility = variant === "mobile" ? "block w-full" : "hidden sm:block";
  const panelPosClasses =
    variant === "mobile"
      ? "left-[2px] right-2 w-auto"
      : "left-0 w-[22rem] max-w-[calc(100vw-2rem)]";
  const triggerWidthClasses = variant === "mobile" ? "justify-start" : "";

  return (
    <div ref={ref} className={`relative ${wrapperVisibility} ${className ?? ""}`}>
      <button
        onClick={() => (open ? closePanel() : openPanel())}
        className={`group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 pl-1.5 pr-2 py-1 text-white hover:bg-white/10 transition-colors ${triggerWidthClasses}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-edf-navy-light text-white text-xs font-bold">
          W
        </span>
        <span className="text-sm font-sans">Walmart, Inc.</span>
        <ChevronDown className="h-4 w-4 opacity-80 group-hover:opacity-100" />
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+8px)] ${panelPosClasses} z-40 bg-white rounded-xl shadow-xl border border-gray-100 transition-opacity duration-150 ease-out ${
            showing ? "opacity-100" : "opacity-0"
          }`}
          role="menu"
          aria-label="Account details"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-edf-dark font-sans tracking-wide">ACCOUNT</p>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-edf-navy text-white text-base font-bold shrink-0">
                W
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-edf-dark font-sans leading-tight">Walmart, Inc.</p>
                {/* Mobile: stacked lines; Desktop: single line with dot */}
                <p className="text-xs text-edf-mid-gray font-sans mt-0.5 leading-snug sm:hidden">
                  <span className="block">{stats.locations} locations</span>
                  <span className="block">United States</span>
                </p>
                <p className="hidden sm:block text-xs text-edf-mid-gray font-sans mt-0.5 leading-snug">
                  {stats.locations} locations · United States
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-[11px] font-semibold text-edf-mid-gray tracking-wide">MAR USAGE</p>
                <p className="text-sm font-sans text-edf-dark mt-0.5 whitespace-nowrap">
                  {stats.monthTherms.toLocaleString()} therms
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-edf-mid-gray tracking-wide">MAR COST</p>
                <p className="text-sm font-sans text-edf-dark mt-0.5">
                  ${stats.monthCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
