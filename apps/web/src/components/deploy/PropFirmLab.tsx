"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type PropFirmRequest = {
  daily_returns: number[];
  starting_equity?: number;
  profit_target_pct?: number;
  max_drawdown_pct?: number;
  max_daily_drawdown_pct?: number;
  days?: number;
  n_sims?: number;
  seed?: number | null;
};

type PropFirmResponse = {
  pass_rate: number;
  fail_rate: number;
  breakeven_rate: number;
  details?: Record<string, unknown>;
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

function makeSamplePayload(seed = 42): PropFirmRequest {
  const rng = makeRng(seed);
  const n = 120;
  const daily_returns: number[] = [];
  for (let i = 0; i < n; i++) {
    daily_returns.push(0.0005 + 0.01 * randn(rng));
  }
  return {
    daily_returns,
    starting_equity: 10_000,
    profit_target_pct: 10,
    max_drawdown_pct: 10,
    max_daily_drawdown_pct: 5,
    days: 30,
    n_sims: 2000,
    seed: 42,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parsePropFirmPayload(text: string): PropFirmRequest {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Payload must be valid JSON.");
  }

  if (!isRecord(json)) throw new Error("Payload must be a JSON object.");
  const returnsRaw = json.daily_returns;
  if (!Array.isArray(returnsRaw)) throw new Error("daily_returns must be an array.");
  const daily_returns = returnsRaw.map((v) => {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error("daily_returns must contain only numbers.");
    }
    return v;
  });
  if (daily_returns.length < 30) {
    throw new Error("daily_returns must have at least 30 values.");
  }

  const out: PropFirmRequest = { daily_returns };
  const numericKeys = [
    "starting_equity",
    "profit_target_pct",
    "max_drawdown_pct",
    "max_daily_drawdown_pct",
  ] as const;
  for (const k of numericKeys) {
    const v = json[k];
    if (v === undefined) continue;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`${k} must be a number.`);
    }
    out[k] = v;
  }

  const intKeys = ["days", "n_sims"] as const;
  for (const k of intKeys) {
    const v = json[k];
    if (v === undefined) continue;
    if (typeof v !== "number" || !Number.isFinite(v) || !Number.isInteger(v)) {
      throw new Error(`${k} must be an integer.`);
    }
    out[k] = v;
  }

  if ("seed" in json) {
    const v = json.seed;
    if (v === null) out.seed = null;
    else if (typeof v !== "number" || !Number.isFinite(v) || !Number.isInteger(v)) {
      throw new Error("seed must be an integer or null.");
    } else out.seed = v;
  }

  return out;
}

export function PropFirmLab() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PropFirmResponse | null>(null);
  const [payloadText, setPayloadText] = useState(() =>
    JSON.stringify(makeSamplePayload(42), null, 2),
  );

  function generateSample() {
    setError(null);
    setResult(null);
    setPayloadText(JSON.stringify(makeSamplePayload(42), null, 2));
  }

  function run() {
    setError(null);
    setResult(null);

    startTransition(async () => {
      let payload: PropFirmRequest;
      try {
        payload = parsePropFirmPayload(payloadText);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid payload.");
        return;
      }

      const res = await fetch("/api/deploy/prop-sim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Simulation failed.");
        return;
      }

      setResult((await res.json().catch(() => null)) as PropFirmResponse | null);
    });
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-text-secondary">Deploy</div>
            <div className="text-lg font-semibold">Prop Firm Simulator</div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-md border border-border-primary bg-background-tertiary p-3">
              <div className="text-xs text-text-muted">Pass Rate</div>
              <div className="text-sm font-semibold text-text-primary">
                {(result.pass_rate * 100).toFixed(1)}%
              </div>
            </div>
            <div className="rounded-md border border-border-primary bg-background-tertiary p-3">
              <div className="text-xs text-text-muted">Fail Rate</div>
              <div className="text-sm font-semibold text-text-primary">
                {(result.fail_rate * 100).toFixed(1)}%
              </div>
            </div>
            <div className="rounded-md border border-border-primary bg-background-tertiary p-3">
              <div className="text-xs text-text-muted">Breakeven</div>
              <div className="text-sm font-semibold text-text-primary">
                {(result.breakeven_rate * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-text-secondary">
            Paste returns + constraints and click Run to estimate pass/fail odds.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

