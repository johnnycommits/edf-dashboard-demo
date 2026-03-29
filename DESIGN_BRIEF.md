# EDF Energy Dashboard — Design Brief

> **Authority:** This document is the single source of truth for all visual and UX decisions on this project. Every agent building UI components in Wave 2+ must read this document before writing a single line of code. When in doubt, refer here first.

> **Research note:** edf.fr was inaccessible at time of authoring. Design decisions are derived from edfenergy.com (EDF UK), established EDF brand standards (navy + orange is a decades-old identity), and the design tokens already implemented in Wave 1. No deviations are expected if edf.fr later becomes accessible.

---

## 1. Brand Overview

EDF (Électricité de France) is a French multinational utility company and one of the world's largest electricity producers. Its brand identity reflects institutional authority, European engineering precision, and a long-standing commitment to large-scale energy infrastructure. The visual language is conservative by design — EDF serves governments, industrial clients, and regulated markets where trust and stability outweigh novelty.

The EDF color signature — deep navy blue paired with a bold orange accent — has been consistent across decades and geographies. Navy conveys institutional weight and technical expertise. Orange provides energy and forward momentum without veering into consumer-brand playfulness. Together, they read as "serious infrastructure company that also wants to help you."

The audience for this dashboard is **Walmart energy procurement managers** — a professional B2B user who reviews natural gas usage across hundreds of retail locations, monitors cost variance, and needs to act on anomalies quickly. This is not a consumer product. It is an operational tool. Every design decision should optimize for data legibility, scannable hierarchy, and low cognitive load during sustained use. The aesthetic target is Bloomberg Terminal meets Palantir Foundry — enterprise-grade, data-forward, calm.

---

## 2. Color System

All tokens are defined in `tailwind.config.ts` and `globals.css` under the `edf-*` namespace.

| Token Name | Hex | Usage Context | When NOT to Use |
|---|---|---|---|
| `edf-navy` | `#003189` | Primary nav background, primary buttons, section headers, active states | Never as a chart series fill — reads as corporate noise against data |
| `edf-navy-dark` | `#00215C` | Nav hover states, pressed button states, dark overlays, depth treatment on surfaces | Never as body text — fails WCAG AA at small sizes on non-white backgrounds |
| `edf-navy-light` | `#1A4DB5` | Secondary buttons, link text, interactive icon tints, focus rings | Never as a large background fill — creates visual heaviness that competes with content |
| `edf-orange` | `#FF6600` | Primary accent: CTAs, trend-up indicators, active filter badges, chart highlight line | Never as a warning/danger signal — orange is brand, not status |
| `edf-orange-light` | `#FF8833` | Hover state on orange buttons, secondary accent, chart annotation markers | Never on white text below 18px — contrast is marginal |
| `bg-dark` | `#0D1B2A` | Full-page dark mode background (reserved for future dark theme) | Not used in primary light-mode layouts |
| `bg-surface` | `#F4F6F9` | Page background, off-white surface behind card grids | Never as card background — cards must stand out with white |
| `bg-card` | `#FFFFFF` | All card surfaces, modal backgrounds, dropdown menus | Never with colored borders unless intentionally highlighting state |
| `text-primary` | `#0D1B2A` | All body copy, table cell values, input field text | Never on dark navy backgrounds |
| `text-secondary` | `#3D4F6E` | Secondary labels, sub-headers, supporting metadata, table column headers | Never for KPI values — too muted for numbers that need to be read at a glance |
| `text-muted` | `#8492A6` | Captions, timestamps, placeholder text, axis labels in charts | Never for interactive elements — fails WCAG on white |
| `border-default` | `#E2E8F0` | Card borders, table row dividers, input field outlines | Never use a colored border for decorative purposes |
| `status-success` | `#10B981` | Positive trends, under-budget indicators, "on target" states | Never use for positive financial variance if it could be confused with savings vs. excess |
| `status-warning` | `#F59E0B` | Approaching threshold alerts, moderate anomalies, "attention needed" states | Never orange — keep warning visually distinct from brand orange |
| `status-danger` | `#EF4444` | Budget exceeded, critical anomalies, data errors, threshold breaches | Never for decorative use or emphasis — reserve strictly for real alerts |
| `chart-grid` | `#E2E8F0` | Chart gridlines, axis lines | Always at 40% opacity — never full opacity |

---

## 3. Typography Rules

**Primary font:** Poppins (geometric sans-serif, Google Fonts). Rounds letterforms convey approachability without losing professionalism. All UI text uses Poppins via `font-sans`.

**Data font:** IBM Plex Mono. Monospace ensures numeric columns align, values scan cleanly, and the tool reads as technical. All metric values, table numbers, and code-adjacent content use `font-mono`.

| Element | Font | Weight | Size (rem) | Size (px) | Line Height | Notes |
|---|---|---|---|---|---|---|
| Page Title | Poppins | 700 | 1.875rem | 30px | 1.2 | Top of page, used once per view |
| Section Header | Poppins | 600 | 1.25rem | 20px | 1.3 | Groups of cards or named dashboard sections |
| Card Title | Poppins | 600 | 0.875rem | 14px | 1.4 | Inside card header, above the metric or chart |
| Large Metric (KPI value) | IBM Plex Mono | 700 | 2.25rem | 36px | 1.0 | Primary number on KPI card — must command the eye |
| Metric Label | Poppins | 500 | 0.75rem | 12px | 1.4 | Above or below the large metric; all-caps, letter-spacing 0.05em |
| Body Text | Poppins | 400 | 0.875rem | 14px | 1.6 | Paragraphs, descriptions, table row content |
| Caption / Small | Poppins | 400 | 0.75rem | 12px | 1.5 | Timestamps, footnotes, helper text below inputs |
| Monospace Data | IBM Plex Mono | 400 | 0.875rem | 14px | 1.5 | Table columns with numbers, therms, cost values |
| Nav Item | Poppins | 500 | 0.875rem | 14px | 1.0 | Top nav links, active state weight bumps to 600 |
| Button | Poppins | 600 | 0.875rem | 14px | 1.0 | All button labels — never italic, never all-caps |
| Tooltip | Poppins | 400 | 0.75rem | 12px | 1.4 | Chart tooltips — value in IBM Plex Mono 500 |
| Axis Label | Poppins | 400 | 0.6875rem | 11px | 1.0 | Chart axis tick labels — `text-muted` color |

---

## 4. Component Patterns

### KPI Card

The KPI card is the most-scanned element on the dashboard. It must be readable in under 1 second.

- **Container:** White background (`bg-card`), 1px border `border-default`, border-radius `rounded-lg` (8px), box-shadow `shadow-sm` (0 1px 3px rgba(0,0,0,0.08))
- **Padding:** 20px all sides (`p-5`)
- **Card Title:** `text-secondary`, Poppins 600, 14px — top of card
- **Large Metric:** IBM Plex Mono 700, 36px, `text-primary` — centered vertically in the card body
- **Metric Label:** Poppins 500, 12px, `text-muted`, all-caps, letter-spacing 0.05em — directly below the metric value
- **Trend Indicator:** Inline with the metric. Up trend: `▲ +4.2%` in `status-success` green. Down trend: `▼ -2.1%` in `status-danger` red. Neutral: `— 0%` in `text-muted`. Font: Poppins 500, 12px. Indicator sits to the right of or below the large metric.
- **No decorative border-top color strips** — do not add a colored accent bar on the top edge of cards; this is a common shadcn pattern that reads as consumer SaaS here
- **Icon (optional):** If an icon is used, it goes top-right of the card in `text-muted` at 20px, never colored

### Data Table Row

- **Default row:** White background, 1px bottom border `border-default`
- **Hover state:** `bg-surface` (`#F4F6F9`) — subtle, not colored
- **Selected state:** `edf-navy` at 8% opacity (`#003189/08`) as background, left border 3px `edf-navy` solid
- **Header row:** `bg-surface` background, Poppins 600 12px `text-secondary`, all-caps, letter-spacing 0.05em
- **Cell padding:** 12px vertical, 16px horizontal (`py-3 px-4`)
- **Numeric columns:** Right-aligned, IBM Plex Mono 14px

### Navigation

- **Top nav:** Full-width, `edf-navy` background (`#003189`), white logo + white nav links
- **Nav link default:** Poppins 500 14px, white at 80% opacity
- **Nav link hover:** White at 100% opacity, no underline, no background change
- **Nav link active:** White 100%, Poppins 600, subtle bottom border 2px `edf-orange`
- **Height:** 60px fixed
- **No sidebar navigation** in initial implementation — top nav only

### Filter Controls

- **Dropdown:** White background, 1px `border-default`, `rounded-md` (6px), Poppins 400 14px `text-primary`. On open: border changes to `edf-navy-light`, shadow-md
- **Date picker:** Same border treatment as dropdown. Selected range fills with `edf-navy` at 10% opacity; selected start/end dates fill `edf-navy` with white text
- **Active filter badge:** `edf-navy` background, white Poppins 500 12px text, `rounded-full`, 4px horizontal padding, 2px vertical padding. Includes an `×` dismiss button at 80% opacity
- **Filter row:** Sits below the page title, above the card grid. Background `bg-surface`, 12px vertical padding

### Chart Container Card

- **Container:** Same as KPI card (white, shadow-sm, rounded-lg, 1px border)
- **Padding:** 20px (`p-5`)
- **Card Title:** Top-left, Poppins 600 14px `text-primary`
- **Card Subtitle:** Directly below title, Poppins 400 12px `text-muted` — describes the time range or data context (e.g., "Last 12 months · Natural gas usage in therms")
- **Chart area:** Starts 12px below the subtitle. Do not let the chart bleed to card edges — maintain 8px minimum horizontal margin inside the chart container
- **Legend:** Below the chart, left-aligned, Poppins 400 12px `text-secondary`. Colored dot (6px circle) before each series label

---

## 5. Layout & Grid System

### Page Structure

- **Max-width:** 1440px, centered (`max-w-[1440px] mx-auto`)
- **Page padding:** 24px horizontal at desktop (`px-6`), 16px at mobile (`px-4`)
- **Top nav:** 60px fixed, full-width
- **Content area:** Starts below nav with `pt-6` padding-top
- **Page title + filter row:** Stacked vertically, `mb-6` below before the card grid

### Dashboard Grid

| Breakpoint | Width | Columns | Card Gap |
|---|---|---|---|
| Mobile | 375px | 1 column | 12px |
| Tablet | 768px | 2 columns | 16px |
| Desktop | 1280px | 4 columns (KPI row) / 2 columns (charts) | 20px |
| Wide | 1440px | 4 columns (KPI row) / 2 columns (charts) | 24px |

- **KPI cards:** Always in a single row of 4 at desktop (4-column grid). Stack 2×2 at tablet, 1×4 at mobile
- **Chart cards:** 2-column grid at desktop and tablet, full-width at mobile
- **Full-width chart:** Allowed for primary trend chart at top of page — spans all columns
- **Card minimum height:** KPI card 120px; Chart card 320px

### Spacing Scale

Use Tailwind's default scale. Key values:
- Between card sections: `gap-6` (24px) at desktop
- Within card padding: `p-5` (20px)
- Between label and value inside card: `gap-1` (4px)
- Between filter controls: `gap-3` (12px)

---

## 6. Data Visualization Style

All charts use **Recharts**. Styling is applied via custom props — do not override Recharts defaults with inline styles; use the component's prop interface.

### Chart Color Order

Use this sequence for multi-series charts. Never deviate from the order — consistency allows users to learn the color meanings across views.

1. `#003189` — EDF Navy (primary series, most important)
2. `#FF6600` — EDF Orange (secondary series or comparison)
3. `#10B981` — Success Green (third series or positive comparison)
4. `#6366F1` — Slate Indigo (fourth series)
5. `#F59E0B` — Amber (fifth series)
6. `#8492A6` — Muted Gray (sixth series or baseline/average line)

### Grid Lines

- **Style:** Horizontal only (no vertical gridlines in bar/line charts)
- **Color:** `#E2E8F0` at `opacity: 0.6`
- **Stroke:** `strokeDasharray="3 3"` (dashed, subtle)
- **Do not** draw a bottom axis line unless the chart requires it for anchoring (e.g., bar charts)

### Axis Labels

- **Font:** Poppins 400, 11px
- **Color:** `#8492A6` (`text-muted`)
- **X-axis:** Date/time labels, abbreviated (e.g., "Jan", "Feb" not "January")
- **Y-axis:** Values with unit suffix where space allows (e.g., "1,200 th" for therms); otherwise unit in the chart subtitle

### Tooltip Style

- **Background:** `#FFFFFF` white
- **Border:** 1px solid `#E2E8F0`
- **Border-radius:** 6px (`rounded-md`)
- **Shadow:** `shadow-md`
- **Padding:** 8px 12px
- **Label (date/category):** Poppins 600 12px `text-primary`
- **Value rows:** IBM Plex Mono 500 12px, colored dot matching series color, `text-primary`
- **Unit:** Poppins 400 11px `text-muted` to the right of the value

### "No Data" State in Charts

- Replace chart area with a centered message: icon (outline style, 32px, `text-muted`) + "No data available" in Poppins 400 14px `text-muted`
- Do not render empty axes or ghost chart shapes
- If partial data: render what exists, show a dotted line connecting to a label "Data unavailable past [date]"

---

## 7. Mobile Strategy

### Priority Content at 375px

**Show (full):**
- All 4 KPI cards (stacked single column)
- Primary trend chart (full width, simplified — hide secondary series if more than 2)
- Navigation (collapsed to hamburger)

**Stack (reorganized):**
- Filter controls collapse to a single "Filters" button that opens a bottom sheet drawer
- Chart cards become single-column, full-width
- Data tables scroll horizontally — freeze the first column (location name)

**Deprioritize / hide:**
- Chart legends move to a tap-to-reveal interaction on mobile (don't show by default)
- Secondary metadata in KPI cards (e.g., comparison period) hidden below a disclosure

### Touch Targets

- Minimum touch target: **44×44px** (Apple HIG standard) for all interactive elements
- Filter chips must be at least 36px tall with sufficient horizontal padding
- Chart tooltips on mobile: triggered by tap, not hover — show a persistent tooltip that dismisses on tap-outside

### Chart Behavior on Mobile

- Line charts: reduce to 1–2 visible series; provide a series selector
- Bar charts: use horizontal bars on mobile when there are more than 6 categories (easier to read labels)
- Axis labels: abbreviate aggressively on mobile (3-char month codes, no year unless critical)
- No zooming/panning required for MVP — static charts are acceptable

### Navigation on Mobile

- **Pattern:** Hamburger menu (top-right of nav bar) that opens a slide-in drawer from the left
- Drawer shows nav links in Poppins 500 16px with `edf-navy` color
- Active link: `edf-orange` left border 3px + Poppins 600
- Do not use a bottom tab bar — this is a dashboard tool, not a mobile app

---

## 8. Tone & Voice

### Dashboard Personality

**It IS:** Precise. Calm. Authoritative. Data-forward.

**It must NEVER feel like:** Playful. Startup. Consumer. Trendy.

### Label Writing Rules

These apply to all UI text: headings, filter labels, column headers, tooltips, empty states.

| Prefer | Avoid | Reason |
|---|---|---|
| "Natural Gas Usage" | "Gas Usage" | Full term is clearer in an energy management context |
| "Location" | "Store" | Agnostic to retail vs. warehouse vs. DC |
| "Therms (th)" | bare numbers without units | Units prevent misreads in multi-energy dashboards |
| "Billing Period" | "Month" | Aligns with how energy procurement teams talk about data |
| "Variance vs. Budget" | "Difference" | Enterprise procurement language |
| "Carbon Intensity" | "CO2" | More precise in energy reporting contexts |
| "Energy Manager" (in copy) | "User" | Reflect the actual audience role |

### Number Formatting

| Value Type | Format | Example |
|---|---|---|
| Therms | `#,##0` — comma separator, no decimals | `12,345 th` |
| Cost | `$#,##0` — dollar sign, comma, no decimals for >$100 | `$12,345` |
| Small cost | `$#,##0.00` — two decimals for values <$100 | `$24.50` |
| Percentage change | `+#.#%` / `-#.#%` — always show sign | `+4.2%` |
| Large round numbers | Abbreviate at 1M+: `$1.2M`, `45.3K th` | `$1.2M` |
| Date — axis | `MMM 'YY` abbreviated | `Jan '25` |
| Date — tooltip | `MMMM D, YYYY` full | `January 15, 2025` |
| Date — card label | `MMM D` | `Jan 15` |

---

## 9. Anti-Patterns (Do NOT Do These)

These are specific to this project. Each has happened on similar dashboard projects and degraded the outcome.

1. **Do NOT use rounded pill-shaped buttons (`rounded-full`)** — This reads as consumer SaaS (Spotify, Duolingo aesthetic). Use `rounded-md` (6px) for all buttons. Enterprise procurement tools use restrained border-radius.

2. **Do NOT put the EDF logo inside the dashboard content area** — This is a demo tool for Walmart, not official EDF software. The EDF brand identity appears only in the nav/header. Using it in cards or charts implies official EDF endorsement that doesn't exist.

3. **Do NOT use bright gradients on KPI cards or chart backgrounds** — Gradients (e.g., `from-blue-500 to-indigo-600`) scream startup landing page. They reduce readability of the data sitting on top and add visual noise that competes with the numbers.

4. **Do NOT use `edf-navy` as a chart series fill color** — Navy is a structural color (nav, headers). When used as data, it collapses into the surrounding UI and creates visual confusion. Use the chart color order defined in Section 6.

5. **Do NOT use `status-danger` red for non-alert emphasis** — Red triggers alarm. If you use it to make a number "stand out" when it isn't actually a problem, users will ignore real alerts. Reserve red strictly for threshold breaches and errors.

6. **Do NOT add decorative colored top-border strips to cards** — The shadcn default component set often includes a colored `border-t-4` style to differentiate card types. This is a consumer SaaS pattern. Our cards are differentiated by content, not decorative color bars.

7. **Do NOT use skeleton loaders shaped like specific UI elements** — Generic skeleton loaders (animated gray bars) are fine. Do not build skeleton shapes that look exactly like the loaded content (e.g., a KPI-card-shaped skeleton) — this is over-engineering for a demo dashboard.

8. **Do NOT show raw database IDs or internal keys in the UI** — Location codes like `WMT-LOC-004821` should never appear in table cells or filter options unless the user explicitly needs them for reference. Use human-readable location names; show IDs in a tooltip or secondary column only.

9. **Do NOT animate data updates with bouncing or elastic easing** — Charts that "pop" and "spring" on load feel playful. Use `ease-out` with 200–300ms duration for any chart entry animations. Prefer no animation for data refreshes — just update the value.

10. **Do NOT use more than 6 series colors in a single chart** — If a chart needs more than 6 data series visible simultaneously, that is a UX problem that should be solved with filtering, not by adding more colors. More than 6 colors in a chart is unreadable at a glance.

11. **Do NOT use text like "Powered by EDF" or "EDF Analytics"** — This dashboard is a demo product. Any branding language that implies it is an official EDF product is misleading. Use neutral language: "EDF Energy Dashboard Demo."

12. **Do NOT center-align body text, table data, or labels** — Center alignment is acceptable only for page titles and empty states. All data-dense content (tables, KPI values, labels) must be left-aligned (or right-aligned for numbers). Center-aligned data is harder to scan.

---

*Last updated: 2026-03-29 · Authored by Wave 1 Brand Research Agent · Version 1.0*
