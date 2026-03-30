# Plan: Nav User Profile + Notifications Components

## Handoff Notes for Codex — Critical Constraints (Read First)

1. **shadcn v4 (base-ui), NOT radix-ui.** The project uses `@base-ui/react` for UI primitives. There is **no** `@radix-ui/react-dropdown-menu` installed and it should NOT be added. Build the dropdown with a custom `useState` + `useRef` click-outside pattern (see implementation details below).

2. **No new dependencies.** All icons come from `lucide-react` (already installed). The avatar uses Next.js `<Image>` component (no extra package needed).

3. **The nav is duplicated in 4 places** and must be extracted before adding features:
   - `app/page.tsx` — lines 84–99
   - `app/location/[id]/page.tsx` — lines 116–126 (loading state)
   - `app/location/[id]/page.tsx` — lines 137–147 (not-found state)
   - `app/location/[id]/page.tsx` — lines 161–171 (main render)
   All four must be replaced with the new `<AppNav />` component.

4. **Tailwind v3** (not v4). Custom color tokens are in `tailwind.config.ts`. Key values: `edf-navy` = `#003189`, `edf-orange` = `#FF6600`, `edf-light-gray` = `#F4F6F9`, `edf-mid-gray` = `#8492A6`. Use these tokens, not hardcoded hex.

5. **Fonts:** `font-sans` = Poppins, `font-mono` = IBM Plex Mono. Follow existing nav conventions: logo text in `font-mono`, UI labels in `font-sans`.

6. **Avatar image path:** `/public/images/john-ludena-headshot.jpg` → served at URL `/images/john-ludena-headshot.jpg`. Use `next/image` with `src="/images/john-ludena-headshot.jpg"`. No `next.config.js` domain config needed — local `/public` assets work out of the box.

7. **`MultiLineChart` prop name mismatch (fix while you're in the file):** `app/location/[id]/page.tsx` builds `yearCompare` with keys `{ month, thisYear, lastYear }`, but `components/charts/MultiLineChart.tsx` expects `{ month, year2024, year2025 }`. Align the page to use `year2024`/`year2025` keys to match the chart component.

---

## Context

The top nav is currently minimal — left logo + right date string. This feature adds a Notifications bell and a User Profile menu (LinkedIn-style) to the right side of the nav, making it feel like a real enterprise SaaS product for the demo.

---

## Files to Create

```
components/nav/AppNav.tsx            — Shared nav bar (extracted + enhanced)
components/nav/NotificationsBell.tsx — Bell icon + badge + dropdown panel
components/nav/UserProfileMenu.tsx   — Avatar + dropdown menu
components/nav/index.ts              — Barrel export
```

## Files to Modify

```
app/page.tsx                   — Replace inline <nav> with <AppNav />
app/location/[id]/page.tsx     — Replace 3× inline <nav> with <AppNav />;
                                 fix MultiLineChart prop names
```

---

## Implementation

### 1. `components/nav/NotificationsBell.tsx`

```tsx
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
        {/* Orange dot badge */}
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
```

### 2. `components/nav/UserProfileMenu.tsx`

```tsx
"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

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
];

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
      {/* Trigger: avatar + "Me ▾" label */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        <Image
          src="/images/john-ludena-headshot.jpg"
          alt="John Ludena"
          width={32}
          height={32}
          className="rounded-full object-cover ring-2 ring-white/40"
        />
        <span className="flex items-center gap-0.5 text-[10px] text-white/75 font-sans leading-none">
          Me <ChevronDown className="w-3 h-3" />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Profile header */}
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
              <p className="text-xs text-edf-mid-gray font-sans mt-0.5 leading-snug">
                Sr. Design Engineer · ABC Energy
              </p>
            </div>
          </div>

          {/* "View profile" pill button */}
          <div className="px-4 py-3 border-b border-gray-100">
            <button className="w-full text-center text-sm font-semibold text-edf-navy border border-edf-navy rounded-full py-1.5 hover:bg-edf-navy/5 transition-colors font-sans">
              View profile
            </button>
          </div>

          {/* Menu sections */}
          {MENU_SECTIONS.map((section, si) => (
            <div key={si} className="border-b border-gray-100 last:border-0 py-2">
              {section.heading && (
                <p className="px-4 py-1 text-xs font-semibold text-edf-dark font-sans">
                  {section.heading}
                </p>
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
```

### 3. `components/nav/AppNav.tsx`

```tsx
import { format } from "date-fns";
import { NotificationsBell } from "./NotificationsBell";
import { UserProfileMenu } from "./UserProfileMenu";

export function AppNav() {
  const today = format(new Date(), "MMM d, yyyy");

  return (
    <nav className="h-14 bg-edf-navy flex items-center px-6 justify-between sticky top-0 z-10 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="font-mono font-bold text-xl text-white tracking-tight">EDF</span>
          <span className="text-white/30 mx-2 select-none">|</span>
          <span className="font-mono font-bold text-xl text-edf-orange tracking-tight">Energy</span>
        </div>
        <span className="text-white/60 font-sans text-sm hidden sm:inline">
          Walmart Energy Portfolio
        </span>
      </div>

      {/* Right: date + notifications + user profile */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm text-white/75 hidden md:inline">{today}</span>
        <NotificationsBell />
        <UserProfileMenu />
      </div>
    </nav>
  );
}
```

### 4. `components/nav/index.ts`

```ts
export { AppNav } from "./AppNav";
export { NotificationsBell } from "./NotificationsBell";
export { UserProfileMenu } from "./UserProfileMenu";
```

### 5. Update `app/page.tsx`

- Add `import { AppNav } from "@/components/nav";`
- Remove the inline `<nav>` block (lines 84–99)
- Replace with `<AppNav />`
- Check if `format` from `date-fns` is still used elsewhere in the file after removing the nav date logic. If not, remove that import too.

### 6. Update `app/location/[id]/page.tsx`

- Add `import { AppNav } from "@/components/nav";`
- Remove the `todayLabel` useMemo (it was only used for the nav)
- Replace all 3 inline `<nav>` blocks (loading, not-found, and main render states) with `<AppNav />`
- Keep the `format` import from `date-fns` — it's still used for date formatting elsewhere in this file
- **Fix MultiLineChart props:** The `yearCompare` array is currently built with keys `{ month, thisYear, lastYear }`. Change them to `{ month, year2024, year2025 }` to match what `MultiLineChart.tsx` expects

---

## Verification Checklist

1. `npm run dev` — no build errors
2. Navigate to `/` — nav shows logo (left), date + bell + avatar (right)
3. Navigate to `/location/WM-CHI-001` — same nav renders on all three page states (loading, not-found, main)
4. Click the bell icon → notifications dropdown opens with 3 placeholder items; click outside → closes
5. Click the avatar/"Me" → profile dropdown opens with avatar, name, "View profile" pill, Account/Manage/Sign out sections; click outside → closes
6. Resize to 375px — date string hides (`hidden md:inline`), bell and avatar remain visible, no overflow
7. `npx tsc --noEmit` — zero errors
