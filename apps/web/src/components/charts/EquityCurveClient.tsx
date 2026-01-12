"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function EquityCurveClient({
  data,
  height = 220,
}: {
  data: { t: string; equity: number }[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis
            hide
            domain={["dataMin", "dataMax"]}
            tickFormatter={(v) => Number(v).toFixed(0)}
          />
          <Tooltip
            contentStyle={{
              background: "#111118",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

