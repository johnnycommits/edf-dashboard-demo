"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MultiLineChartProps {
  data: Array<{ month: string; thisYear: number; lastYear: number }>;
  height?: number;
}

export function MultiLineChart({ data, height = 220 }: MultiLineChartProps) {
  const fmtMonth = (m: string) => {
    const [y, mm] = m.split("-");
    const date = new Date(Number(y), Number(mm) - 1, 1);
    return date.toLocaleString(undefined, { month: "short" });
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">This Year vs Last Year</CardTitle>
        <p className="text-xs text-edf-mid-gray">Monthly totals (last 6 months)</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#8492A6" }} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ fontFamily: "var(--font-mono)", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6 }} />
            <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 12 }} />
            <Line type="monotone" dataKey="thisYear" name="This Year" stroke="#003189" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="lastYear" name="Last Year" stroke="#FF6600" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
