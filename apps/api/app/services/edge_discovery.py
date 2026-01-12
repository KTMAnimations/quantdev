from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
import pandas as pd
from scipy import stats
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import TimeSeriesSplit, cross_val_score

from app.utils.data_fetcher import fetch_ohlcv


@dataclass(frozen=True)
class _FeatureLogic:
    name: str
    kind: str
    params: dict[str, float]


class EdgeDiscoveryService:
    def __init__(self) -> None:
        self._tscv = TimeSeriesSplit(n_splits=5)

    async def analyze_feature(
        self,
        feature_description: str,
        symbol: str,
        timeframe: str,
        lookback_days: int = 252,
    ) -> dict:
        feature_logic = self._parse_feature_description(feature_description)
        prices = await fetch_ohlcv(symbol=symbol, timeframe=timeframe, lookback_days=lookback_days)
        feature = self._compute_feature(prices, feature_logic)
        stats_results = self._run_statistical_tests(feature, prices)
        ml_results = self._run_ml_analysis(feature, prices)
        bootstrap_results = self._bootstrap_analysis(feature, prices)
        recommendation = self._generate_recommendation(stats_results, ml_results)

        return {
            "feature_name": feature_description,
            "statistical_significance": stats_results,
            "ml_importance": ml_results,
            "confidence_intervals": bootstrap_results,
            "recommendation": recommendation,
        }

    def _parse_feature_description(self, description: str) -> _FeatureLogic:
        desc = description.lower().strip()
        if "rsi" in desc:
            return _FeatureLogic(name="RSI", kind="rsi", params={"period": 14})
        if "sma" in desc or "moving average" in desc:
            return _FeatureLogic(name="SMA", kind="sma", params={"period": 20})
        if "ema" in desc:
            return _FeatureLogic(name="EMA", kind="ema", params={"period": 20})
        if "momentum" in desc:
            return _FeatureLogic(name="Momentum", kind="momentum", params={"period": 10})
        return _FeatureLogic(name="ZScore", kind="zscore_return", params={"period": 20})

    def _compute_feature(self, prices: pd.DataFrame, logic: _FeatureLogic) -> pd.Series:
        close = prices["close"].astype(float)
        period = int(logic.params.get("period", 20))

        if logic.kind == "sma":
            return close.rolling(period).mean()
        if logic.kind == "ema":
            return close.ewm(span=period, adjust=False).mean()
        if logic.kind == "momentum":
            return close.pct_change(periods=period)
        if logic.kind == "rsi":
            delta = close.diff()
            up = delta.clip(lower=0)
            down = (-delta).clip(lower=0)
            roll_up = up.ewm(alpha=1 / period, adjust=False).mean()
            roll_down = down.ewm(alpha=1 / period, adjust=False).mean()
            rs = roll_up / roll_down.replace(0, np.nan)
            return 100 - (100 / (1 + rs))
        if logic.kind == "zscore_return":
            ret = close.pct_change()
            mu = ret.rolling(period).mean()
            sigma = ret.rolling(period).std(ddof=0).replace(0, np.nan)
            return (ret - mu) / sigma

        raise ValueError(f"Unsupported feature kind: {logic.kind}")

    def _run_statistical_tests(self, feature: pd.Series, prices: pd.DataFrame) -> dict:
        close = prices["close"].astype(float)
        fwd_ret = close.pct_change().shift(-1)

        df = pd.DataFrame({"feature": feature, "fwd_ret": fwd_ret}).dropna()
        if df.empty:
            return {
                "ic_mean": None,
                "ic_ir": None,
                "p_value": None,
                "is_significant": False,
                "n": 0,
            }

        ic, p_value = stats.spearmanr(df["feature"].values, df["fwd_ret"].values)
        ic_mean = float(ic) if not math.isnan(ic) else 0.0
        ic_std = float(np.std(df["fwd_ret"].values, ddof=0)) if len(df) > 1 else 0.0
        ic_ir = ic_mean / ic_std if ic_std > 0 else 0.0
        is_significant = bool(p_value is not None and p_value < 0.05)

        return {
            "ic_mean": ic_mean,
            "ic_ir": float(ic_ir),
            "p_value": float(p_value) if p_value is not None else None,
            "is_significant": is_significant,
            "n": int(len(df)),
        }

    def _run_ml_analysis(self, feature: pd.Series, prices: pd.DataFrame) -> dict:
        close = prices["close"].astype(float)
        fwd_ret = close.pct_change().shift(-1)

        df = pd.DataFrame({"feature": feature, "fwd_ret": fwd_ret}).dropna()
        if df.empty:
            return {
                "cv_accuracy": None,
                "has_predictive_power": False,
                "importance": None,
                "n": 0,
            }

        X = df[["feature"]].values
        y = (df["fwd_ret"].values > 0).astype(int)

        clf = RandomForestClassifier(
            n_estimators=200,
            max_depth=4,
            random_state=42,
            n_jobs=-1,
        )
        scores = cross_val_score(clf, X, y, cv=self._tscv, scoring="accuracy")
        cv_accuracy = float(np.mean(scores))

        clf.fit(X, y)
        importance = float(clf.feature_importances_[0]) if hasattr(clf, "feature_importances_") else None
        has_predictive_power = bool(cv_accuracy > 0.52)

        return {
            "cv_accuracy": cv_accuracy,
            "has_predictive_power": has_predictive_power,
            "importance": importance,
            "n": int(len(df)),
        }

    def _bootstrap_analysis(self, feature: pd.Series, prices: pd.DataFrame) -> dict:
        close = prices["close"].astype(float)
        fwd_ret = close.pct_change().shift(-1)
        df = pd.DataFrame({"feature": feature, "fwd_ret": fwd_ret}).dropna()
        if df.empty:
            return {"ic_mean_ci": [None, None]}

        rng = np.random.default_rng(42)
        ics = []
        for _ in range(200):
            sample = df.sample(frac=1.0, replace=True, random_state=int(rng.integers(0, 1_000_000)))
            ic, _ = stats.spearmanr(sample["feature"].values, sample["fwd_ret"].values)
            if ic is not None and not math.isnan(ic):
                ics.append(float(ic))

        if not ics:
            return {"ic_mean_ci": [None, None]}

        lo, hi = np.percentile(ics, [2.5, 97.5])
        return {"ic_mean_ci": [float(lo), float(hi)]}

    def _generate_recommendation(self, stats_results: dict, ml_results: dict) -> str:
        if stats_results.get("is_significant") and ml_results.get("has_predictive_power"):
            return "Strong: statistically significant and ML shows predictive power."
        if stats_results.get("is_significant"):
            return "Moderate: statistically significant; ML predictive power unclear."
        if ml_results.get("has_predictive_power"):
            return "Moderate: ML shows predictive power; statistical significance unclear."
        return "Weak: no clear evidence of predictive power."

