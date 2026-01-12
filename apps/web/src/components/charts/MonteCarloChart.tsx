"use client";

import dynamic from "next/dynamic";

export const MonteCarloChart = dynamic(
  () => import("./MonteCarloChartClient").then((m) => m.MonteCarloChartClient),
  { ssr: false },
);

