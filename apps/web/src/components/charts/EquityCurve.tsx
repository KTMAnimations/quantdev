"use client";

import dynamic from "next/dynamic";

export const EquityCurve = dynamic(
  () => import("./EquityCurveClient").then((m) => m.EquityCurveClient),
  { ssr: false },
);
