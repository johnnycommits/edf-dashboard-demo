import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const colors = [
  { name: "edf-navy", hex: "#003189", label: "EDF Navy (Primary)" },
  { name: "edf-navy-dark", hex: "#00215C", label: "EDF Navy Dark" },
  { name: "edf-navy-light", hex: "#1A4DB5", label: "EDF Navy Light" },
  { name: "edf-orange", hex: "#FF6600", label: "EDF Orange (Accent)" },
  { name: "edf-orange-light", hex: "#FF8833", label: "EDF Orange Light" },
  { name: "edf-dark", hex: "#0D1B2A", label: "EDF Dark (Background)" },
  { name: "edf-light-gray", hex: "#F4F6F9", label: "EDF Light Gray (Surface)" },
  { name: "edf-mid-gray", hex: "#8492A6", label: "EDF Mid Gray (Muted)" },
  { name: "edf-dark-gray", hex: "#3D4F6E", label: "EDF Dark Gray (Secondary)" },
  { name: "edf-white", hex: "#FFFFFF", label: "EDF White" },
  { name: "edf-success", hex: "#22C55E", label: "EDF Success" },
  { name: "edf-warning", hex: "#F59E0B", label: "EDF Warning" },
  { name: "edf-danger", hex: "#EF4444", label: "EDF Danger" },
];

const chartColors = [
  { name: "Chart 1", hex: "#003189" },
  { name: "Chart 2", hex: "#FF6600" },
  { name: "Chart 3", hex: "#22C55E" },
  { name: "Chart 4", hex: "#8B5CF6" },
  { name: "Chart 5", hex: "#F59E0B" },
];

const spacingScale = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-edf-light-gray p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-edf-navy mb-2">EDF Design System Reference</h1>
          <p className="text-edf-mid-gray text-lg">
            Design tokens, typography, spacing, and component previews for the ABC Energy Dashboard.
          </p>
          <p className="text-sm text-edf-mid-gray mt-1 font-mono">
            Dev reference only — can be deleted before production
          </p>
        </div>

        <Separator />

        {/* Color Swatches */}
        <section>
          <h2 className="text-2xl font-semibold text-edf-dark mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="rounded-lg overflow-hidden shadow-sm border border-edf-border">
                <div className="h-20 w-full" style={{ backgroundColor: color.hex }} />
                <div className="bg-white p-3">
                  <p className="font-mono text-xs font-semibold text-edf-dark">{color.hex}</p>
                  <p className="text-xs text-edf-mid-gray mt-0.5">{color.label}</p>
                  <p className="font-mono text-xs text-edf-dark-gray mt-0.5">{color.name}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-edf-dark mt-8 mb-4">Chart Color Sequence</h3>
          <div className="flex gap-4">
            {chartColors.map((color) => (
              <div key={color.name} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full shadow-sm border border-edf-border"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-mono text-xs text-edf-mid-gray">{color.hex}</span>
                <span className="text-xs text-edf-dark-gray">{color.name}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Typography Scale */}
        <section>
          <h2 className="text-2xl font-semibold text-edf-dark mb-6">Typography Scale</h2>
          <div className="bg-white rounded-lg border border-edf-border p-6 space-y-6">
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">h1 / text-4xl / font-bold / Source Sans 3</p>
              <h1 className="text-4xl font-bold text-edf-dark">ABC Energy Dashboard</h1>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">h2 / text-3xl / font-semibold</p>
              <h2 className="text-3xl font-semibold text-edf-dark">Natural Gas Consumption</h2>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">h3 / text-2xl / font-semibold</p>
              <h3 className="text-2xl font-semibold text-edf-dark">Monthly Usage Report</h3>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">h4 / text-xl / font-medium</p>
              <h4 className="text-xl font-medium text-edf-dark">Store #4821 — Houston, TX</h4>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">h5 / text-lg / font-medium</p>
              <h5 className="text-lg font-medium text-edf-dark">Peak Demand Period</h5>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">h6 / text-base / font-medium</p>
              <h6 className="text-base font-medium text-edf-dark">Q3 2024 Analysis</h6>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">body / text-base / font-normal</p>
              <p className="text-base text-edf-dark">
                EDF is a major energy company committed to helping enterprises optimize their energy consumption
                through data-driven insights and advanced analytics platforms.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">small / text-sm</p>
              <p className="text-sm text-edf-dark-gray">
                Data refreshed every 15 minutes. Last updated: March 29, 2026 at 14:32 UTC.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">caption / text-xs</p>
              <p className="text-xs text-edf-mid-gray">* All figures in MMBtu unless otherwise stated.</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-mono text-edf-mid-gray mb-1">mono / font-mono / IBM Plex Mono (data values)</p>
              <p className="font-mono text-lg text-edf-navy">42,381.7 MMBtu</p>
              <p className="font-mono text-base text-edf-dark-gray mt-1">$0.0823 / MMBtu</p>
              <p className="font-mono text-sm text-edf-mid-gray mt-1">+12.4% YoY</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Spacing Scale */}
        <section>
          <h2 className="text-2xl font-semibold text-edf-dark mb-6">Spacing Scale</h2>
          <div className="bg-white rounded-lg border border-edf-border p-6">
            <div className="space-y-3">
              {spacingScale.map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <span className="font-mono text-xs text-edf-mid-gray w-20">{`p-${size} / ${size * 4}px`}</span>
                  <div
                    className="bg-edf-navy-light rounded"
                    style={{ width: `${size * 4}px`, height: "16px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Component Preview */}
        <section>
          <h2 className="text-2xl font-semibold text-edf-dark mb-6">Component Preview</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-edf-border p-6">
              <h3 className="text-sm font-mono text-edf-mid-gray mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-edf-navy hover:bg-edf-navy-dark text-white">
                  Primary Action
                </Button>
                <Button variant="outline" className="border-edf-navy text-edf-navy hover:bg-edf-light-gray">
                  Secondary Action
                </Button>
                <Button className="bg-edf-orange hover:bg-edf-orange-light text-white">
                  Accent Action
                </Button>
                <Button variant="ghost" className="text-edf-dark-gray hover:text-edf-navy">
                  Ghost Button
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-edf-border p-6">
              <h3 className="text-sm font-mono text-edf-mid-gray mb-4">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-edf-navy text-white">Active</Badge>
                <Badge className="bg-edf-orange text-white">Alert</Badge>
                <Badge className="bg-edf-success text-white">On Target</Badge>
                <Badge className="bg-edf-warning text-white">Warning</Badge>
                <Badge className="bg-edf-danger text-white">Critical</Badge>
                <Badge variant="outline" className="border-edf-navy text-edf-navy">Draft</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-edf-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-edf-navy text-lg">Monthly Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-3xl font-semibold text-edf-dark">
                    42,381 <span className="text-sm font-sans text-edf-mid-gray">MMBtu</span>
                  </p>
                  <p className="text-sm text-edf-success mt-1">↓ 3.2% vs last month</p>
                  <p className="text-xs text-edf-mid-gray mt-2">March 2026 • All Walmart stores</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-edf-orange border-edf-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-edf-dark text-lg">Peak Demand Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-edf-dark-gray">Store #4821 exceeded demand threshold on March 14</p>
                  <div className="mt-3 flex gap-2">
                    <Badge className="bg-edf-orange text-white text-xs">High Priority</Badge>
                    <Badge variant="outline" className="text-xs border-edf-border text-edf-mid-gray">Unresolved</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CSS Variables Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-edf-dark mb-6">CSS Variables Reference</h2>
          <div className="bg-edf-dark rounded-lg p-6 overflow-x-auto">
            <pre className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre">
{`:root {
  /* EDF Brand Colors */
  --edf-navy:           #003189;   /* Primary brand navy */
  --edf-navy-dark:      #00215C;   /* Hover states */
  --edf-navy-light:     #1A4DB5;   /* Accents */
  --edf-orange:         #FF6600;   /* Accent orange */
  --edf-orange-light:   #FF8833;   /* Orange hover */
  --edf-dark:           #0D1B2A;   /* Near-black bg */
  --edf-surface:        #F4F6F9;   /* Page background */
  --edf-surface-card:   #FFFFFF;   /* Card background */
  --edf-text-primary:   #0D1B2A;   /* Primary text */
  --edf-text-secondary: #3D4F6E;   /* Secondary text */
  --edf-text-muted:     #8492A6;   /* Muted text */
  --edf-border:         #E2E8F0;   /* Borders */

  /* Chart Sequence */
  --edf-chart-1: #003189;  /* Navy */
  --edf-chart-2: #FF6600;  /* Orange */
  --edf-chart-3: #22C55E;  /* Green */
  --edf-chart-4: #8B5CF6;  /* Purple */
  --edf-chart-5: #F59E0B;  /* Amber */
}`}
            </pre>
          </div>
        </section>

        <div className="pb-8 text-center text-xs text-edf-mid-gray">
          ABC Energy Dashboard Demo — Design System Reference
          <br />
          Colors: EDF brand fallback values used (edf.fr inaccessible during build) — navy #003189, orange #FF6600
        </div>
      </div>
    </div>
  );
}
