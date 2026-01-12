"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type RegressionRequest = {
  returns: number[];
  factors: Record<string, number[]>;
};

type RegressionResponse = {
  r2: number;
  coefficients: Record<string, number>;
  p_values: Record<string, number>;
  intercept: number;
};

function makeRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function randn(rng: () => number) {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makeSamplePayload(seed = 42): RegressionRequest {
  const rng = makeRng(seed);
  const n = 120;
  const market: number[] = [];
  const momentum: number[] = [];
  const returns: number[] = [];

  for (let i = 0; i < n; i++) {
    market.push(0.0002 + 0.01 * randn(rng));
    momentum.push(0.0001 + 0.008 * randn(rng));
  }
  for (let i = 0; i < n; i++) {
    returns.push(0.0003 + 0.7 * market[i] + 0.2 * momentum[i] + 0.01 * randn(rng));
  }

  return {
    returns,
    factors: {
      market,
      momentum,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseRegressionPayload(text: string): RegressionRequest {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Payload must be valid JSON.");
  }

  if (!isRecord(json)) throw new Error("Payload must be a JSON object.");
  const returnsRaw = json.returns;
  const factorsRaw = json.factors;

  if (!Array.isArray(returnsRaw)) throw new Error("returns must be an array.");
  const returns = returnsRaw.map((v) => {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error("returns must contain only numbers.");
    }
    return v;
  });
  if (returns.length < 30) throw new Error("returns must have at least 30 values.");

  if (!isRecord(factorsRaw)) throw new Error("factors must be an object.");
  const factors: Record<string, number[]> = {};
  const factorEntries = Object.entries(factorsRaw);
  if (factorEntries.length === 0) throw new Error("At least one factor is required.");

  for (const [name, seriesRaw] of factorEntries) {
    if (!Array.isArray(seriesRaw)) throw new Error(`factors.${name} must be an array.`);
    const series = seriesRaw.map((v) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new Error(`factors.${name} must contain only numbers.`);
      }
      return v;
    });
    if (series.length < 30) throw new Error(`factors.${name} must have at least 30 values.`);
    factors[name] = series;
  }

  return { returns, factors };
}

export function RegressionLab() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegressionResponse | null>(null);
  const [payloadText, setPayloadText] = useState(() =>
    JSON.stringify(makeSamplePayload(42), null, 2),
  );

  const factors = useMemo(() => Object.keys(result?.coefficients ?? {}), [result]);

  function generateSample() {
    setError(null);
    setResult(null);
    setPayloadText(JSON.stringify(makeSamplePayload(42), null, 2));
  }

  function run() {
    setError(null);
    setResult(null);

    startTransition(async () => {
      let payload: RegressionRequest;
      try {
        payload = parseRegressionPayload(payloadText);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid payload.");
        return;
      }

      const res = await fetch("/api/optimize/regression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Regression failed.");
        return;
      }

      setResult((await res.json().catch(() => null)) as RegressionResponse | null);
    });
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-text-secondary">Optimize</div>
            <div className="text-lg font-semibold">Regression Lab</div>
          </div>
          <div className="flex items-center gap-2">
            <Button disabled={isPending} onClick={generateSample} type="button" variant="secondary">
              Sample
            </Button>
            <Button disabled={isPending} onClick={run} type="button">
              {isPending ? "Running…" : "Run"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-text-secondary">Payload</div>
          <Textarea
            className="font-mono text-xs min-h-[220px]"
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
          />
        </div>

        {error ? <div className="text-sm text-error">{error}</div> : null}

        {result ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-md border border-border-primary bg-background-tertiary p-3">
                <div className="text-xs text-text-muted">R²</div>
                <div className="text-sm font-semibold text-text-primary">
                  {result.r2.toFixed(4)}
                </div>
              </div>
              <div className="rounded-md border border-border-primary bg-background-tertiary p-3">
                <div className="text-xs text-text-muted">Intercept</div>
                <div className="text-sm font-semibold text-text-primary">
                  {result.intercept.toFixed(6)}
                </div>
              </div>
              <div className="rounded-md border border-border-primary bg-background-tertiary p-3">
                <div className="text-xs text-text-muted">Factors</div>
                <div className="text-sm font-semibold text-text-primary">
                  {factors.length}
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border-primary overflow-hidden">
              <div className="grid grid-cols-3 gap-0 bg-background-secondary text-xs text-text-muted">
                <div className="px-3 py-2">Factor</div>
                <div className="px-3 py-2">Coefficient</div>
                <div className="px-3 py-2">p-value</div>
              </div>
              <div className="divide-y divide-border-primary bg-background-tertiary">
                {factors.map((name) => (
                  <div key={name} className="grid grid-cols-3 gap-0 text-sm">
                    <div className="px-3 py-2 font-medium text-text-primary">
                      {name}
                    </div>
                    <div className="px-3 py-2 text-text-secondary font-mono">
                      {(result.coefficients[name] ?? 0).toFixed(6)}
                    </div>
                    <div className="px-3 py-2 text-text-secondary font-mono">
                      {(result.p_values[name] ?? 0).toExponential(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-text-secondary">
            Paste data and click Run to compute coefficients and p-values.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

