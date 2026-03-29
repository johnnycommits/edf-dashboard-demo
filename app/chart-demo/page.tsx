"use client";

import {
  UsageLineChart,
  UsageBarChart,
  UsageAreaChart,
  MultiLineChart,
  UsageDonutChart,
} from "@/components/charts";

// Generate 30 days of sample data
function generateDailyData(seed = 1) {
  return Array.from({ length: 30 }, (_, i) => {
    const day = new Date(2024, 0, i + 1);
    const label = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      date: label,
      value: Math.round(200 + Math.sin((i + seed) * 0.4) * 80 + Math.random() * 40),
    };
  });
}

const lineData = generateDailyData(1);
const barData = generateDailyData(2).slice(0, 14); // 2 weeks for readability
const areaData = generateDailyData(3);

const multiLineData = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(2024, 0, i + 1);
  const label = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    date: label,
    site_a: Math.round(150 + Math.sin(i * 0.3) * 60 + Math.random() * 30),
    site_b: Math.round(120 + Math.sin(i * 0.5 + 1) * 50 + Math.random() * 25),
    site_c: Math.round(90 + Math.sin(i * 0.4 + 2) * 40 + Math.random() * 20),
  };
});

const donutData = [
  { name: "Heating", value: 4820 },
  { name: "Cooking", value: 2310 },
  { name: "Process Heat", value: 6450 },
  { name: "Other", value: 1200 },
];

const thermsFormatter = (v: number) => `${v.toLocaleString()} therms`;

export default function ChartDemoPage() {
  return (
    <main className="min-h-screen bg-edf-light-gray p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-edf-dark">Chart Component Gallery</h1>
          <p className="text-edf-dark-gray mt-1">
            Visual QA for all 5 EDF-branded Recharts components
          </p>
        </div>

        <div className="grid gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              UsageLineChart
            </p>
            <UsageLineChart
              data={lineData}
              title="Daily Gas Usage — January 2024"
              subtitle="Walmart Distribution Center · Therms consumed per day"
              valueFormatter={(v) => `${v}`}
              height={280}
            />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              UsageBarChart
            </p>
            <UsageBarChart
              data={barData}
              title="Bi-Weekly Consumption Breakdown"
              subtitle="First 14 days of January · Hover bars to highlight"
              valueFormatter={(v) => `${v}`}
              height={280}
            />
          </div>

          {/* Area Chart */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              UsageAreaChart
            </p>
            <UsageAreaChart
              data={areaData}
              title="Cumulative Usage Trend"
              subtitle="30-day rolling view · January 2024"
              valueFormatter={(v) => `${v}`}
              height={280}
            />
          </div>

          {/* Multi-Line Chart */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              MultiLineChart
            </p>
            <MultiLineChart
              data={multiLineData}
              lines={[
                { key: "site_a", label: "Site A — North Dock" },
                { key: "site_b", label: "Site B — South Dock" },
                { key: "site_c", label: "Site C — Cold Storage" },
              ]}
              title="Multi-Site Comparison"
              subtitle="Three facilities · Daily therms · January 2024"
              valueFormatter={(v) => `${v}`}
              height={280}
            />
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              UsageDonutChart
            </p>
            <UsageDonutChart
              data={donutData}
              title="Usage by Category"
              subtitle="Total therms by end-use · January 2024"
              valueFormatter={thermsFormatter}
              height={320}
            />
          </div>

          {/* Empty State Demo */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              Empty State (data=[])
            </p>
            <UsageLineChart
              data={[]}
              title="No Data Example"
              subtitle="When data is empty, a fallback message is shown"
              height={200}
            />
          </div>

          {/* Loading State Demo */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs font-mono text-edf-mid-gray mb-4 uppercase tracking-wider">
              Loading State (isLoading=true)
            </p>
            <UsageBarChart
              data={[]}
              title="Loading Example"
              subtitle="Skeleton shimmer while data fetches"
              isLoading={true}
              height={200}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
