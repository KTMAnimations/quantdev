"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type IdeationResult = {
  feature_name?: string;
  recommendation?: string;
  statistical_significance?: {
    ic_mean?: number | null;
    ic_ir?: number | null;
    p_value?: number | null;
    is_significant?: boolean | null;
    n?: number | null;
  };
  ml_importance?: {
    cv_accuracy?: number | null;
    has_predictive_power?: boolean | null;
    importance?: number | null;
    n?: number | null;
  };
  confidence_intervals?: {
    ic_mean_ci?: [number | null, number | null];
  };
};

export function IdeationForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdeationResult | null>(null);

  const [description, setDescription] = useState("RSI oversold");
  const [symbol, setSymbol] = useState("SPY");
  const [timeframe, setTimeframe] = useState("1D");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await fetch("/api/ideation/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, symbol, timeframe }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Request failed.");
        return;
      }

      const json = (await res.json().catch(() => null)) as IdeationResult | null;
      if (!json) {
        setError("Invalid response.");
        return;
      }
      setResult(json);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 space-y-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <div className="text-sm text-text-secondary">Feature description</div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='e.g. "RSI oversold" or "20-day SMA crossover"'
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-text-secondary">Symbol</div>
                <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-text-secondary">Timeframe</div>
                <select
                  className="h-10 w-full rounded-md border border-border-primary bg-background-tertiary px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="1D">1D</option>
                  <option value="1H">1H</option>
                  <option value="15M">15M</option>
                  <option value="5M">5M</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full" disabled={isPending} type="submit">
                  {isPending ? "Analyzing…" : "Analyze"}
                </Button>
              </div>
            </div>
          </form>

          {error ? <div className="text-sm text-error">{error}</div> : null}
        </CardContent>
      </Card>

      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-sm text-text-muted">IC Mean</div>
              <div className="text-2xl font-semibold">
                {result.statistical_significance?.ic_mean?.toFixed?.(4) ?? "—"}
              </div>
              <div className="text-sm text-text-secondary">
                p={result.statistical_significance?.p_value?.toFixed?.(4) ?? "—"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-sm text-text-muted">CV Accuracy</div>
              <div className="text-2xl font-semibold">
                {result.ml_importance?.cv_accuracy?.toFixed?.(3) ?? "—"}
              </div>
              <div className="text-sm text-text-secondary">
                predictive=
                {String(result.ml_importance?.has_predictive_power ?? false)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-sm text-text-muted">Recommendation</div>
              <div className="text-sm text-text-primary">
                {result.recommendation ?? "—"}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

