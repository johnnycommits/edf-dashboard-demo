"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings as SettingsIcon, HelpCircle, ArrowRight } from "lucide-react";
// no caret icon per request

// Menu items updated to align with the mock screenshot
const MENU_ITEMS = ["Settings", "Help & support", "Sign out"] as const;

// Map menu labels to routes and enabled state.
// Only enable items with real destinations to avoid 404s.
const PROFILE_ITEM_META: Record<string, { href?: string; enabled: boolean }> = {
  Settings: { href: "/settings", enabled: false },
  "Help & support": { href: "/help", enabled: false },
  "Sign out": { enabled: true },
};

export function UserProfileMenu() {
  const [open, setOpen] = useState(false);
  const [showing, setShowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Absolute positioning under trigger; no viewport listeners needed

  function openPanel() {
    setOpen(true);
    requestAnimationFrame(() => setShowing(true));
  }

  function closePanel() {
    setShowing(false);
    setOpen(false);
  }

  return (
    <div ref={ref}>
      <button
        onClick={() => (open ? closePanel() : openPanel())}
        className={`relative flex flex-col items-center hover:opacity-80 transition-opacity ${
          open
            ? "after:content-[''] after:absolute after:-bottom-[13px] after:right-[10px] after:w-0 after:h-0 after:border-x-[8px] after:border-x-transparent after:border-b-[8px] after:border-b-white after:z-[60] after:pointer-events-none"
            : ""
        }`}
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
        <div
          className={`absolute top-full right-[10px] w-[calc(100%-20px)] md:w-[min(18rem,calc(100vw-1rem))] z-50 bg-white rounded-xl shadow-xl border border-gray-100 transition-opacity duration-150 ease-out ${
            showing ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Notch now lives on the button via ::after */}
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
              <p className="text-xs text-edf-mid-gray font-sans mt-0.5 leading-snug">Energy Manager · Walmart</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            {MENU_ITEMS.map((item) => {
              const meta = PROFILE_ITEM_META[item] ?? { enabled: false };
              const isActive = meta.href && pathname === meta.href;

              const icon =
                item === "Settings" ? (
                  <SettingsIcon className="w-4 h-4 text-edf-mid-gray" />
                ) : item === "Help & support" ? (
                  <HelpCircle className="w-4 h-4 text-edf-mid-gray" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-edf-mid-gray" />
                );

              const baseClasses =
                "w-full flex items-center gap-3 px-4 py-2 text-sm font-sans" +
                " hover:bg-edf-light-gray transition-colors";

              if (!meta.enabled) {
                return (
                  <div
                    key={item}
                    role="menuitem"
                    aria-disabled="true"
                    className={`${baseClasses} text-edf-mid-gray cursor-not-allowed`}
                  >
                    {icon}
                    <span>{item}</span>
                  </div>
                );
              }

              if (item === "Sign out") {
                return (
                  <button
                    key={item}
                    role="menuitem"
                    className={`${baseClasses} text-edf-dark`}
                    onClick={() => {
                      setOpen(false);
                      console.log("Sign out clicked");
                    }}
                  >
                    {icon}
                    <span>{item}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item}
                  role="menuitem"
                  href={meta.href!}
                  className={`${baseClasses} ${isActive ? "bg-edf-light-gray" : "text-edf-dark"}`}
                  onClick={() => setOpen(false)}
                >
                  {icon}
                  <span>{item}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
