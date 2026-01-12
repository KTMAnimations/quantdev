"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Percentiles = {
  p5: number[];
  p50: number[];
  p95: number[];
};

export function MonteCarloChartClient({
  percentiles,
  height = 320,
}: {
  percentiles: Percentiles;
  height?: number;
}) {
  const data = percentiles.p50.map((_, i) => ({
    step: i,
    p5: percentiles.p5[i],
    p50: percentiles.p50[i],
    p95: percentiles.p95[i],
  }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="step" stroke="#71717a" />
          <YAxis stroke="#71717a" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #27272a",
            }}
            labelStyle={{ color: "#ffffff" }}
          />
          <Area
            type="monotone"
            dataKey="p95"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.1}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="p5"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.1}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

