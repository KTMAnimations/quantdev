from __future__ import annotations

from typing import Callable

import numpy as np
from scipy.stats import bootstrap


class BootstrapService:
    async def run(
        self,
        series: list[float],
        statistic: str,
        confidence_level: float,
        n_resamples: int,
        seed: int | None = None,
    ) -> dict:
        data = np.asarray(series, dtype=float)
        data = data[np.isfinite(data)]
        if data.size < 5:
            raise ValueError("series must contain at least 5 finite values")

        stat_fn: Callable[[np.ndarray], float]
        if statistic == "median":
            stat_fn = lambda x: float(np.median(x))
        else:
            stat_fn = lambda x: float(np.mean(x))

        rng = np.random.default_rng(seed)
        res = bootstrap(
            (data,),
            stat_fn,
            confidence_level=confidence_level,
            n_resamples=n_resamples,
            random_state=rng,
            method="percentile",
        )

        estimate = stat_fn(data)
        ci = res.confidence_interval
        return {
            "statistic": statistic,
            "estimate": float(estimate),
            "ci_low": float(ci.low),
            "ci_high": float(ci.high),
        }

