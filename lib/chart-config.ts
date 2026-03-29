export const EDF_CHART_COLORS = {
  primary: '#003189',    // edf-navy
  secondary: '#FF6600',  // edf-orange
  tertiary: '#22C55E',   // success green
  quaternary: '#8B5CF6', // purple
  quinary: '#F59E0B',    // amber
  muted: '#8492A6',      // mid-gray
  grid: '#E2E8F0',       // border color
  background: '#FFFFFF',
} as const;

export const CHART_SERIES_COLORS = [
  EDF_CHART_COLORS.primary,
  EDF_CHART_COLORS.secondary,
  EDF_CHART_COLORS.tertiary,
  EDF_CHART_COLORS.quaternary,
  EDF_CHART_COLORS.quinary,
];

export const DEFAULT_CHART_MARGINS = { top: 10, right: 10, left: 0, bottom: 0 };
