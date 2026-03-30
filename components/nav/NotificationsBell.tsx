"use client";
import { useRef, useState, useEffect } from "react";
import { Bell } from "lucide-react";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-white" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-edf-orange rounded-full border border-edf-navy" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-3">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-edf-mid-gray font-sans">
            Notifications
          </p>
          {["Usage spike at Chicago store", "Monthly report ready", "New alert threshold reached"].map((msg, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-edf-light-gray cursor-pointer">
              <span className="mt-1 w-2 h-2 rounded-full bg-edf-navy shrink-0" />
              <p className="text-sm text-edf-dark font-sans">{msg}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

