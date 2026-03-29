"use client";

import type { DailyUsageRecord } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface RecentRecordsTableProps {
  records: DailyUsageRecord[]; // expects exactly 14 records, most recent first or sorted by caller
}

export function RecentRecordsTable({ records }: RecentRecordsTableProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">
          Recent Daily Records
        </CardTitle>
        <p className="text-xs text-edf-mid-gray">Last 14 days</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white border-b">
              <TableRow>
                <TableHead className="text-xs font-mono text-edf-dark-gray">Date</TableHead>
                <TableHead className="text-right text-xs font-mono text-edf-dark-gray">Usage (therms)</TableHead>
                <TableHead className="text-right text-xs font-mono text-edf-dark-gray">Cost (USD)</TableHead>
                <TableHead className="text-right text-xs font-mono text-edf-dark-gray">Avg Temp (°F)</TableHead>
                <TableHead className="text-xs font-mono text-edf-dark-gray">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r, idx) => (
                <TableRow key={r.date} className={idx % 2 === 1 ? "bg-edf-light-gray/60" : undefined}>
                  <TableCell className="text-sm font-mono text-edf-dark">
                    {format(parseISO(r.date), "EEE, MMM d")}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-right text-edf-dark">
                    {r.thermsUsed.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-right text-edf-dark">
                    ${r.costUSD.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-right text-edf-dark">{r.avgTempF}</TableCell>
                  <TableCell className="text-sm italic text-edf-mid-gray">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

