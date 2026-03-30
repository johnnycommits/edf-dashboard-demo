"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NotificationsBell } from "./NotificationsBell";
import { UserProfileMenu } from "./UserProfileMenu";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Locations", href: "/locations" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
] as const;

export function AppNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <nav className="h-14 bg-edf-navy flex items-center px-6 justify-between sticky top-0 z-20 shadow-md">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-xl text-white tracking-tight">ABC</span>
            <span className="font-mono font-bold text-xl text-edf-orange tracking-tight">ENERGY</span>
          </div>
          <span className="text-white/30 select-none hidden sm:inline">|</span>
          <span className="text-white/60 font-sans text-sm hidden sm:inline">Walmart, Inc.</span>
        </div>

        {/* Right: Desktop nav + actions */}
        <div className="flex items-center gap-4">
          {/* Desktop nav items */}
          <ul className="hidden md:flex items-center gap-6 mr-2">
            {NAV_ITEMS.map((item) => {
              const disabled = item.href !== "/";
              const isActive = pathname === item.href;
              const baseClasses = "flex items-center text-sm font-sans transition-colors";
              if (disabled) {
                return (
                  <li key={item.href}>
                    <span
                      role="link"
                      aria-disabled="true"
                      className={`${baseClasses} text-white/40 cursor-not-allowed`}
                    >
                      <span
                        aria-hidden
                        className={`mr-2 inline-block w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-edf-orange" : "bg-white/0"
                        }`}
                      />
                      {item.label}
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${baseClasses} text-white/90 hover:text-white`}
                  >
                    <span
                      aria-hidden
                      className={`mr-2 inline-block w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-edf-orange" : "bg-white/0"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Separator matching the one after logo */}
          <span className="text-white/30 select-none hidden sm:inline">|</span>

          {/* Notifications + User */}
          <NotificationsBell />
          <UserProfileMenu />

          {/* Mobile hamburger (to the RIGHT of user) */}
          <button
            className="md:hidden ml-1 -mr-1 p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] md:hidden z-50"
        />
      )}

      {/* Mobile slide-in drawer (dark theme) */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 bg-edf-navy-dark shadow-2xl border-l border-white/10 md:hidden z-[60] transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
          <span className="text-sm font-semibold text-white font-sans">Menu</span>
          <button
            className="p-2 rounded-md hover:bg-white/10"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="p-2">
          <ul className="divide-y divide-white/10">
            {NAV_ITEMS.map((item) => {
              const disabled = item.href !== "/";
              const isActive = pathname === item.href;
              if (disabled) {
                return (
                  <li key={item.href}>
                    <div
                      role="link"
                      aria-disabled="true"
                      className="flex items-center gap-3 px-3 py-3 text-white/60 font-sans text-base cursor-not-allowed"
                    >
                      <span
                        aria-hidden
                        className={`inline-block w-2 h-2 rounded-full ${
                          isActive ? "bg-edf-orange" : "bg-white/0"
                        }`}
                      />
                      {item.label}
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 text-white font-sans text-base hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      aria-hidden
                      className={`inline-block w-2 h-2 rounded-full ${
                        isActive ? "bg-edf-orange" : "bg-white/0"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
