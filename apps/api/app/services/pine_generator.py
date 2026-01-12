from __future__ import annotations

from textwrap import dedent

from app.utils.llm_client import LLMClient


class PineGeneratorService:
    async def generate(self, description: str, kind: str) -> dict:
        desc = description.strip()
        is_indicator = kind == "indicator"

        header = "//@version=5\n"
        client = LLMClient()

        prompt = dedent(
            f"""
            You are an expert TradingView Pine Script v5 developer.

            Task: Write a Pine Script v5 {kind} from the description below.
            - Output ONLY valid Pine Script (no markdown, no explanations).
            - The script MUST start with: //@version=5
            - Use clean inputs and sensible defaults.

            Description:
            {desc}
            """
        ).strip()

        llm = await client.chat(prompt)
        llm_reply = str(llm.get("reply", "")).strip()
        if llm.get("backend") not in {"stub", "error"} and llm_reply:
            code = llm_reply
            if "```" in code:
                code = code.replace("```pine", "").replace("```", "").strip()
            if not code.startswith("//@version=5"):
                code = header + code.lstrip()
            notes = f"LLM-generated ({llm.get('backend')}, model={llm.get('model')})"
            return {"kind": kind, "pine_code": code, "notes": notes}

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

        return {"kind": kind, "pine_code": code, "notes": "Template-based generator (LLM disabled/unavailable)."}
