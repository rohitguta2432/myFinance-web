/**
 * ProjectionChart — SSR-safe wrapper.
 * Recharts touches `window` at import time, so this MUST be loaded with ssr:false.
 */
import dynamic from "next/dynamic";

export const ProjectionChart = dynamic(
  () => import("./ProjectionChartInner").then((m) => ({ default: m.ProjectionChartInner })),
  { ssr: false, loading: () => null }
);
