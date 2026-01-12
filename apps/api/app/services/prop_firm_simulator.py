from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass(frozen=True)
class _Outcome:
    passed: int
    failed: int
    breakeven: int


class PropFirmSimulatorService:
    async def simulate(
        self,
        daily_returns: list[float],
        starting_equity: float,
        profit_target_pct: float,
        max_drawdown_pct: float,
        max_daily_drawdown_pct: float,
        days: int,
        n_sims: int,
        seed: int | None = None,
    ) -> dict:
        returns = np.asarray(daily_returns, dtype=float)
        returns = returns[np.isfinite(returns)]
        if returns.size == 0:
            returns = np.array([0.0])

        rng = np.random.default_rng(seed)
        outcomes = _Outcome(passed=0, failed=0, breakeven=0)

        target_equity = starting_equity * (1.0 + profit_target_pct / 100.0)
        max_dd_equity = starting_equity * (1.0 - max_drawdown_pct / 100.0)

        details: dict[str, float] = {"target_equity": float(target_equity), "max_dd_equity": float(max_dd_equity)}

        passed = 0
        failed = 0
        breakeven = 0

        for _ in range(n_sims):
            equity = float(starting_equity)
            peak = equity
            ok = True

            sim_returns = rng.choice(returns, size=days, replace=True)
            for r in sim_returns:
                daily_start = equity
                equity *= float(1.0 + r)

                peak = max(peak, equity)
                overall_dd = (peak - equity) / peak if peak > 0 else 0.0
                daily_dd = (daily_start - equity) / daily_start if daily_start > 0 else 0.0

                if equity <= max_dd_equity:
                    ok = False
                    break
                if daily_dd >= (max_daily_drawdown_pct / 100.0):
                    ok = False
                    break
                if equity >= target_equity:
                    break

            if not ok:
                failed += 1
            elif equity >= target_equity:
                passed += 1
            else:
                breakeven += 1

        total = float(n_sims)
        return {
            "pass_rate": passed / total,
            "fail_rate": failed / total,
            "breakeven_rate": breakeven / total,
            "details": {**details, "n_sims": float(n_sims), "days": float(days)},
        }

