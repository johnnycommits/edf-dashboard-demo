# EDF Energy Dashboard Demo

A Walmart natural gas usage analytics dashboard built for an EDF enterprise client presentation. Displays consumption metrics, cost analysis, and usage trends across Walmart store locations powered by EDF-sourced natural gas.

The aesthetic targets Bloomberg/Palantir-style enterprise data density — not a startup SaaS tool.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Design System

Visit [http://localhost:3000/design-system](http://localhost:3000/design-system) for the full design token reference (dev only — delete before production).

### Colors

EDF brand colors were used as fallback values (edf.fr was not accessible during scaffolding):

| Token | Hex | Usage |
|---|---|---|
| `edf-navy` | `#003189` | Primary brand, buttons, links |
| `edf-navy-dark` | `#00215C` | Hover states, dark surfaces |
| `edf-navy-light` | `#1A4DB5` | Accents, highlights |
| `edf-orange` | `#FF6600` | Accent color, alerts, CTAs |
| `edf-orange-light` | `#FF8833` | Orange hover states |
| `edf-dark` | `#0D1B2A` | Dark background, near-black |
| `edf-light-gray` | `#F4F6F9` | Page background surface |
| `edf-mid-gray` | `#8492A6` | Muted text, placeholders |
| `edf-dark-gray` | `#3D4F6E` | Secondary text |
| `edf-white` | `#FFFFFF` | Card surfaces |

### Typography

- **Body font:** [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) — EDF's actual brand font (Marianne) is not available as a web font. Source Sans 3 is the closest professional substitute with similar humanist proportions and excellent legibility at data-dense sizes.
- **Monospace font:** [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — used for all numeric data values, KPIs, and metric displays. Conveys precision and technical credibility.

## Project Structure

```
app/
  layout.tsx          — Root layout with font setup
  page.tsx            — Landing/index page
  globals.css         — EDF design tokens + Tailwind base
  design-system/
    page.tsx          — Dev-only design token reference
components/
  ui/                 — shadcn/ui components (Radix primitives)
lib/
  utils.ts            — cn() utility
tailwind.config.ts    — EDF color extensions + font families
```

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — strict mode
- **Tailwind CSS v3** — utility-first styling
- **shadcn/ui** — accessible component primitives (Radix UI)
- **Recharts** — data visualization
- **date-fns** — date formatting utilities
