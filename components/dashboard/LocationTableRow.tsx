"use client"

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SparkLine } from "./SparkLine";
import type { LocationSummary } from "@/lib/data";

interface LocationTableRowProps {
  summary: LocationSummary;
  sparklineData: number[];
  onClick: () => void;
  variant: "desktop" | "mobile";
}

function getStatus(changePercent: number): { label: string; className: string } {
  if (changePercent > 25) return { label: "Alert", className: "bg-red-50 text-red-700 border-red-200" };
  if (changePercent > 10) return { label: "High", className: "bg-orange-50 text-orange-700 border-orange-200" };
  if (changePercent < -10) return { label: "Low", className: "bg-green-50 text-green-700 border-green-200" };
  return { label: "Normal", className: "bg-gray-50 text-gray-600 border-gray-200" };
}

export function LocationTableRow({ summary, sparklineData, onClick, variant }: LocationTableRowProps) {
  const { location, currentMonthUsage, changePercent, totalCostYTD } = summary;
  const status = getStatus(changePercent);
  const changeColor =
    changePercent > 0 ? "text-red-600" : changePercent < 0 ? "text-green-600" : "text-edf-mid-gray";
  const changeSign = changePercent > 0 ? "+" : "";

  if (variant === "desktop") {
    return (
      <TableRow
        className="hover:bg-edf-light-gray cursor-pointer transition-colors"
        onClick={onClick}
      >
        <TableCell className="py-3">
          <div className="font-medium text-edf-dark text-sm">{location.name}</div>
          <div className="text-xs text-edf-mid-gray">
            {location.city}, {location.stateCode}
          </div>
        </TableCell>
        <TableCell className="py-3">
          <SparkLine data={sparklineData} />
        </TableCell>
        <TableCell className="font-mono text-sm text-edf-dark py-3">
          {currentMonthUsage.toLocaleString()}
        </TableCell>
        <TableCell className="py-3">
          <span className={`font-mono text-sm font-medium ${changeColor}`}>
            {changeSign}
            {changePercent.toFixed(1)}%
          </span>
        </TableCell>
        <TableCell className="font-mono text-sm text-edf-dark py-3">
          ${totalCostYTD.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </TableCell>
        <TableCell className="py-3">
          <Badge variant="outline" className={`text-xs ${status.className}`}>
            {status.label}
          </Badge>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Card className="bg-white cursor-pointer hover:shadow-md transition-shadow py-0" onClick={onClick}>
      <CardContent className="p-4">
        <div className="font-semibold text-edf-dark text-sm">{location.name}</div>
        <div className="text-xs text-edf-mid-gray mb-3">
          {location.city}, {location.stateCode}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-edf-mid-gray uppercase tracking-wide mb-0.5">This Month</div>
            <div className="font-mono font-medium text-edf-dark text-sm">
              {currentMonthUsage.toLocaleString()} therms
            </div>
            <div className={`font-mono text-sm ${changeColor}`}>
              {changeSign}
              {changePercent.toFixed(1)}% MoM
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-edf-mid-gray uppercase tracking-wide mb-0.5">YTD Cost</div>
            <div className="font-mono font-medium text-edf-dark text-sm">
              ${totalCostYTD.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <Badge variant="outline" className={`text-xs mt-1.5 ${status.className}`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
