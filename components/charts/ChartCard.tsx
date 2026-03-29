"use client";

import React from "react";

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  children: React.ReactNode;
  height?: number;
}

export function ChartCard({
  title,
  subtitle,
  isLoading,
  isEmpty,
  children,
  height = 300,
}: ChartCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {title && <div className="h-5 bg-edf-light-gray rounded w-1/3 mb-2" />}
        {subtitle && <div className="h-4 bg-edf-light-gray rounded w-1/2 mb-4" />}
        <div
          className="bg-edf-light-gray rounded"
          style={{ height }}
        />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div>
        {title && <h3 className="text-base font-semibold text-edf-dark mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-edf-mid-gray mb-3">{subtitle}</p>}
        <div
          className="flex items-center justify-center text-edf-mid-gray text-sm border border-dashed border-border rounded-lg"
          style={{ height }}
        >
          No data available for the selected period.
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="text-base font-semibold text-edf-dark mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-edf-mid-gray mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}
