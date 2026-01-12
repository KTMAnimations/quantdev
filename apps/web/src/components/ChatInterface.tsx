"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me to turn an idea into a workflow: ideation → pine → monte carlo → regression → deploy.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSend = useMemo(() => input.trim().length > 0 && !isPending, [input, isPending]);

  function onSend() {
    const content = input.trim();
    if (!content) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);

    startTransition(async () => {
      const res = await fetch("/api/quant-copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const body = (await res.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null;

      const reply =
        body?.reply ??
        (body?.error ? `Error: ${body.error}` : "No response (chat not wired yet).");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    });
  }

  return (
    <Card className="bg-background-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border-primary">
          <div className="text-lg font-semibold">Quant Copilot</div>
          <div className="text-sm text-text-secondary">
            Prototype chat UI (wire to ChatMock/LLM next).
          </div>
        </div>

        <div className="p-6 space-y-3 max-h-[420px] overflow-auto">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-lg bg-accent-primary/15 border border-accent-primary/20 px-4 py-3 text-sm"
                  : "mr-auto max-w-[85%] rounded-lg bg-background-tertiary border border-border-primary px-4 py-3 text-sm"
              }
            >
              {m.content}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-border-primary space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: "Test whether RSI oversold predicts SPY returns"'
          />
          <div className="flex justify-end">
            <Button disabled={!canSend} onClick={onSend} type="button">
              {isPending ? "Sending…" : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

