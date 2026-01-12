"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PineScriptEditor } from "@/components/editor/PineScriptEditor";

type PineResult = {
  kind?: string;
  pine_code?: string;
  notes?: string | null;
};

export function PineGenerateForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PineResult | null>(null);
  const [pineCode, setPineCode] = useState("");

  const [description, setDescription] = useState(
    "EMA crossover strategy: enter long on 10/30 crossover, exit on crossunder",
  );
  const [kind, setKind] = useState<"strategy" | "indicator">("strategy");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await fetch("/api/pine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, kind }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Request failed.");
        return;
      }

      const json = (await res.json().catch(() => null)) as PineResult | null;
      if (!json) {
        setError("Invalid response.");
        return;
      }
      setResult(json);
      setPineCode(json.pine_code ?? "");
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 space-y-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <div className="text-sm text-text-secondary">Description</div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='e.g. "RSI mean-reversion indicator"'
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-end">
              <div className="space-y-2 md:w-48">
                <div className="text-sm text-text-secondary">Kind</div>
                <select
                  className="h-10 w-full rounded-md border border-border-primary bg-background-tertiary px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as "strategy" | "indicator")}
                >
                  <option value="strategy">strategy</option>
                  <option value="indicator">indicator</option>
                </select>
              </div>
              <Button disabled={isPending} type="submit">
                {isPending ? "Generating…" : "Generate Pine"}
              </Button>
            </div>
          </form>

          {error ? <div className="text-sm text-error">{error}</div> : null}
        </CardContent>
      </Card>

      {result?.pine_code ? (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <PineScriptEditor value={pineCode} onChange={setPineCode} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
