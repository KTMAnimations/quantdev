from __future__ import annotations

from typing import Any

import numpy as np
import statsmodels.api as sm


class RegressionService:
    async def analyze(self, returns: list[float], factors: dict[str, list[float]]) -> dict[str, Any]:
        y = np.asarray(returns, dtype=float)
        X_cols = []
        names = []
        for name, values in factors.items():
            names.append(name)
            X_cols.append(np.asarray(values, dtype=float))

        X = np.column_stack(X_cols)
        min_len = min(y.shape[0], X.shape[0])
        y = y[:min_len]
        X = X[:min_len]
        X = sm.add_constant(X)

        model = sm.OLS(y, X, missing="drop").fit()

        coef = {names[i]: float(model.params[i + 1]) for i in range(len(names))}
        p_values = {names[i]: float(model.pvalues[i + 1]) for i in range(len(names))}
        intercept = float(model.params[0])

        return {
            "r2": float(model.rsquared),
            "coefficients": coef,
            "p_values": p_values,
            "intercept": intercept,
        }

