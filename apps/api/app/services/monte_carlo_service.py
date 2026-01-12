from __future__ import annotations

import numpy as np


class MonteCarloService:
    async def simulate(
        self,
        equity_curve: list[float],
        n_sims: int,
        horizon: int,
        seed: int | None = None,
    ) -> dict:
        curve = np.asarray(equity_curve, dtype=float)
        if curve.size < 5:
            raise ValueError("equity_curve must contain at least 5 points")

        returns = np.diff(curve) / curve[:-1]
        returns = returns[np.isfinite(returns)]
        if returns.size == 0:
            returns = np.array([0.0])

        rng = np.random.default_rng(seed)
        paths: list[list[float]] = []
        terminal: list[float] = []

        start = float(curve[-1])
        for _ in range(n_sims):
            sampled = rng.choice(returns, size=horizon, replace=True)
            path = [start]
            equity = start
            for r in sampled:
                equity *= float(1.0 + r)
                path.append(float(equity))
            paths.append(path)
            terminal.append(float(path[-1]))

        paths_arr = np.asarray(paths, dtype=float)
        p5_path = np.percentile(paths_arr, 5, axis=0)
        p50_path = np.percentile(paths_arr, 50, axis=0)
        p95_path = np.percentile(paths_arr, 95, axis=0)

        terminal_arr = np.asarray(terminal, dtype=float)
        pct05, pct50, pct95 = np.percentile(terminal_arr, [5, 50, 95])

        bands = {
            "p5": [float(x) for x in p5_path.tolist()],
            "p50": [float(x) for x in p50_path.tolist()],
            "p95": [float(x) for x in p95_path.tolist()],
            "p05_terminal": [float(pct05)],
            "p50_terminal": [float(pct50)],
            "p95_terminal": [float(pct95)],
        }

        return {
            "n_sims": int(n_sims),
            "horizon": int(horizon),
            "paths": paths,
            "terminal_values": terminal,
            "confidence_bands": bands,
        }
