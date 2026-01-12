import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const SAMPLES = [
  {
    name: "EMA Crossover Strategy",
    description: "Enter long when fast EMA crosses above slow EMA. Exit on crossunder.",
    category: "strategy",
    author: "OpenQuant",
    votes: 12,
    isInfluencer: true,
    pineCode: `//@version=5
strategy("EMA Crossover (OpenQuant)", overlay=true)
fastLen = input.int(10)
slowLen = input.int(30)
fast = ta.ema(close, fastLen)
slow = ta.ema(close, slowLen)
longCond = ta.crossover(fast, slow)
exitCond = ta.crossunder(fast, slow)
if (longCond)
    strategy.entry("L", strategy.long)
if (exitCond)
    strategy.close("L")
plot(fast, color=color.new(color.purple, 0))
plot(slow, color=color.new(color.gray, 0))
`,
  },
  {
    name: "RSI Mean Reversion Indicator",
    description: "Highlights oversold/overbought regimes with optional midline.",
    category: "indicator",
    author: "OpenQuant",
    votes: 7,
    isInfluencer: false,
    pineCode: `//@version=5
indicator("RSI Mean Reversion (OpenQuant)", overlay=false)
len = input.int(14)
os = input.int(30)
ob = input.int(70)
r = ta.rsi(close, len)
hline(ob, "Overbought", color=color.new(color.red, 60))
hline(50, "Mid", color=color.new(color.gray, 80))
hline(os, "Oversold", color=color.new(color.green, 60))
plot(r, color=color.new(color.purple, 0))
`,
  },
  {
    name: "VWAP Pullback Strategy",
    description: "Buy pullbacks above VWAP with a simple momentum filter.",
    category: "strategy",
    author: "OpenQuant",
    votes: 4,
    isInfluencer: false,
    pineCode: `//@version=5
strategy("VWAP Pullback (OpenQuant)", overlay=true)
useRsi = input.bool(true, "Use RSI Filter")
rsiLen = input.int(14)
v = ta.vwap(hlc3)
r = ta.rsi(close, rsiLen)
pullback = close > v and ta.crossunder(close, v * 1.005)
filterOk = not useRsi or r > 50
if (pullback and filterOk)
    strategy.entry("L", strategy.long)
plot(v, color=color.new(color.orange, 0))
`,
  },
];

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.strategyLibrary.count();
  if (existing > 0) {
    return NextResponse.json({ seeded: false, count: existing });
  }

  await prisma.strategyLibrary.createMany({ data: SAMPLES });
  return NextResponse.json({ seeded: true, count: SAMPLES.length });
}

