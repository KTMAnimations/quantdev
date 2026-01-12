"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LibraryItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string | null;
  votes: number;
  isInfluencer: boolean;
};

type ListResponse = {
  items: LibraryItem[];
};

export function LibraryBrowser() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<LibraryItem[]>([]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    return params.toString();
  }, [query]);

  function load() {
    setError(null);
    setNotice(null);

    startTransition(async () => {
      const res = await fetch(`/api/library/list${queryString ? `?${queryString}` : ""}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Failed to load library.");
        return;
      }
      const json = (await res.json().catch(() => null)) as ListResponse | null;
      setItems(json?.items ?? []);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function seed() {
    setError(null);
    setNotice(null);

    startTransition(async () => {
      const res = await fetch("/api/library/seed", { method: "POST" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Failed to seed library.");
        return;
      }
      const body = (await res.json().catch(() => null)) as
        | { seeded?: boolean; count?: number }
        | null;
      setNotice(
        body?.seeded ? `Seeded ${body?.count ?? 0} sample items.` : "Library already has items.",
      );
      load();
    });
  }

  function save(libraryId: string) {
    setError(null);
    setNotice(null);

    startTransition(async () => {
      const res = await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libraryId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Failed to save strategy.");
        return;
      }
      setNotice("Saved to your strategies.");
    });
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1 space-y-2">
            <div className="text-sm text-text-secondary">Search</div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. EMA, RSI, VWAP…"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button disabled={isPending} onClick={load} type="button" variant="secondary">
              {isPending ? "Loading…" : "Search"}
            </Button>
            <Button disabled={isPending} onClick={seed} type="button">
              Seed samples
            </Button>
          </div>
        </div>

        {error ? <div className="text-sm text-error">{error}</div> : null}
        {notice ? <div className="text-sm text-text-secondary">{notice}</div> : null}

        {items.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border-primary bg-background-tertiary p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-text-primary">{item.name}</div>
                    <div className="text-xs text-text-muted">
                      {item.category}
                      {item.isInfluencer ? " · influencer" : ""}
                      {item.author ? ` · ${item.author}` : ""}
                      {item.votes ? ` · ${item.votes} votes` : ""}
                    </div>
                  </div>
                  <Button
                    disabled={isPending}
                    onClick={() => save(item.id)}
                    size="sm"
                    type="button"
                  >
                    Save
                  </Button>
                </div>
                <div className="text-sm text-text-secondary line-clamp-3">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-text-secondary">
            No library items found. Click “Seed samples” to add a few starter templates.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

