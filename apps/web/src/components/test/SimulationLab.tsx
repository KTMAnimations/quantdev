"use client";

import { useMemo, useState, useTransition } from "react";

import { MonteCarloChart } from "@/components/charts/MonteCarloChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type MonteCarloResponse = {
  confidence_bands?: {
    p5?: number[];
    p50?: number[];
    p95?: number[];
  };
};

type BootstrapResponse = {
  estimate: number;
  ci_low: number;
  ci_high: number;
};

export function SimulationLab({
  equityCurve,
}: {
  equityCurve: { t: string; equity: number }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mc, setMc] = useState<MonteCarloResponse | null>(null);
  const [boot, setBoot] = useState<BootstrapResponse | null>(null);

  const equity = useMemo(() => equityCurve.map((p) => p.equity), [equityCurve]);
  const returns = useMemo(() => {
    const out: number[] = [];
    for (let i = 1; i < equity.length; i++) {
      out.push(equity[i] / equity[i - 1] - 1);
    }
    return out;
  }, [equity]);

  function run() {
    setError(null);
    setMc(null);
    setBoot(null);

    startTransition(async () => {
      const mcRes = await fetch("/api/test/monte-carlo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equity_curve: equity,
          n_sims: 800,
          horizon: 60,
          seed: 42,
        }),
      });

      if (!mcRes.ok) {
        const body = (await mcRes.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Monte Carlo failed.");
        return;
      }
      setMc((await mcRes.json().catch(() => null)) as MonteCarloResponse | null);

      const bootRes = await fetch("/api/test/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          series: returns,
          statistic: "mean",
          confidence_level: 0.95,
          n_resamples: 5000,
          seed: 42,
        }),
      });

      if (!bootRes.ok) {
        const body = (await bootRes.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Bootstrap failed.");
        return;
      }
      setBoot((await bootRes.json().catch(() => null)) as BootstrapResponse | null);
    });
  }

  const bands = mc?.confidence_bands;
  const hasBands = Boolean(bands?.p5 && bands?.p50 && bands?.p95);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-text-secondary">Simulations</div>
            <div className="text-lg font-semibold">Monte Carlo + Bootstrap</div>
          </div>
          <Button disabled={isPending} onClick={run} type="button">
            {isPending ? "Running…" : "Run"}
          </Button>
        </div>

        {error ? <div className="text-sm text-error">{error}</div> : null}

        {hasBands ? (
          <MonteCarloChart
            percentiles={{
              p5: bands?.p5 ?? [],
              p50: bands?.p50 ?? [],
              p95: bands?.p95 ?? [],
            }}
          />
        ) : (
          <div className="text-sm text-text-secondary">
            Click Run to generate confidence bands.
          </div>
        )}

        {boot ? (
          <div className="text-sm text-text-secondary">
            Bootstrap mean return CI (95%):{" "}
            <span className="text-text-primary">
              {boot.ci_low.toFixed(5)} to {boot.ci_high.toFixed(5)}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

