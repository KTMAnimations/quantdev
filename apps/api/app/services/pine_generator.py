from __future__ import annotations

from textwrap import dedent


class PineGeneratorService:
    async def generate(self, description: str, kind: str) -> dict:
        desc = description.strip()
        is_indicator = kind == "indicator"

        header = "//@version=5\n"
        if is_indicator:
            code = header + dedent(
                f"""
                indicator("OpenQuant Indicator", overlay=true)
                // Description: {desc}

                length = input.int(20, "Length", minval=1)
                src = input.source(close, "Source")
                ma = ta.sma(src, length)
                plot(ma, "SMA", color=color.new(color.purple, 0))
                """
            ).strip()
        else:
            code = header + dedent(
                f"""
                strategy("OpenQuant Strategy", overlay=true, initial_capital=10000)
                // Description: {desc}

                fastLen = input.int(10, "Fast Length", minval=1)
                slowLen = input.int(30, "Slow Length", minval=1)
                fast = ta.ema(close, fastLen)
                slow = ta.ema(close, slowLen)

                longSignal = ta.crossover(fast, slow)
                exitSignal = ta.crossunder(fast, slow)

                if (longSignal)
                    strategy.entry("Long", strategy.long)
                if (exitSignal)
                    strategy.close("Long")

                plot(fast, "Fast EMA", color=color.new(color.purple, 0))
                plot(slow, "Slow EMA", color=color.new(color.indigo, 0))
                """
            ).strip()

        return {"kind": kind, "pine_code": code, "notes": "Template-based generator (replace with LLM/RAG)."}

