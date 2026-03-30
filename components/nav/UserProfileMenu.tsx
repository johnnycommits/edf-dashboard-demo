"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
// no caret icon per request

const MENU_SECTIONS = [
  {
    heading: "Account",
    items: ["Settings & Privacy", "Help", "Language"],
  },
  {
    heading: "Manage",
    items: ["Account Settings"],
  },
  {
    heading: undefined,
    items: ["Sign out"],
  },
] as const;

export function UserProfileMenu() {
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
        className="flex flex-col items-center hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        <Image
          src="/images/john-ludena-headshot.jpg"
          alt="John Ludena"
          width={32}
          height={32}
          className="rounded-full object-cover ring-2 ring-white/40"
        />
        {/* Label below avatar removed per request */}
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-start gap-3 p-4 border-b border-gray-100">
            <Image
              src="/images/john-ludena-headshot.jpg"
              alt="John Ludena"
              width={52}
              height={52}
              className="rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-edf-dark font-sans leading-tight">John Ludena</p>
              <p className="text-xs text-edf-mid-gray font-sans mt-0.5 leading-snug">Sr. Design Engineer · ABC Energy</p>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <button className="w-full text-center text-sm font-semibold text-edf-navy border border-edf-navy rounded-full py-1.5 hover:bg-edf-navy/5 transition-colors font-sans">
              View profile
            </button>
          </div>

          {MENU_SECTIONS.map((section, si) => (
            <div key={si} className="border-b border-gray-100 last:border-0 py-2">
              {section.heading && (
                <p className="px-4 py-1 text-xs font-semibold text-edf-dark font-sans">{section.heading}</p>
              )}
              {section.items.map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 text-sm text-edf-dark-gray hover:bg-edf-light-gray font-sans transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
