from __future__ import annotations

import numpy as np


def max_drawdown(equity_curve: list[float]) -> float:
    curve = np.asarray(equity_curve, dtype=float)
    if curve.size == 0:
        return 0.0
    peak = np.maximum.accumulate(curve)
    dd = (peak - curve) / peak
    dd = dd[np.isfinite(dd)]
    return float(dd.max()) if dd.size else 0.0

