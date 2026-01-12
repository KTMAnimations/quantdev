from __future__ import annotations

from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field


class IdeationAnalyzeRequest(BaseModel):
    description: str
    symbol: str
    timeframe: str = "1D"
    lookback_days: int = Field(default=252, ge=30, le=5000)


class IdeationAnalyzeResponse(BaseModel):
    feature_name: str
    statistical_significance: dict[str, Any]
    ml_importance: dict[str, Any]
    confidence_intervals: dict[str, Any]
    recommendation: str


class Trade(BaseModel):
    entry_date: date
    exit_date: date
    pnl: float


class BacktestRequest(BaseModel):
    symbol: str
    timeframe: str = "1D"
    start_date: date
    end_date: date
    initial_capital: float = Field(default=10_000, gt=0)
    trades: list[Trade] = Field(default_factory=list)


class BacktestResponse(BaseModel):
    symbol: str
    timeframe: str
    start_date: date
    end_date: date
    initial_capital: float
    total_return: float
    max_drawdown: float
    win_rate: float
    total_trades: int
    equity_curve: list[dict[str, Any]]
    trades: list[dict[str, Any]]


class MonteCarloRequest(BaseModel):
    equity_curve: list[float] = Field(min_length=5)
    n_sims: int = Field(default=1000, ge=100, le=20000)
    horizon: int = Field(default=252, ge=10, le=5000)
    seed: int | None = None


class MonteCarloResponse(BaseModel):
    n_sims: int
    horizon: int
    paths: list[list[float]]
    terminal_values: list[float]
    confidence_bands: dict[str, list[float]]


class RegressionRequest(BaseModel):
    returns: list[float] = Field(min_length=30)
    factors: dict[str, list[float]] = Field(min_length=1)


class RegressionResponse(BaseModel):
    r2: float
    coefficients: dict[str, float]
    p_values: dict[str, float]
    intercept: float


class PineGenerateRequest(BaseModel):
    description: str
    kind: Literal["strategy", "indicator"] = "strategy"


class PineGenerateResponse(BaseModel):
    kind: str
    pine_code: str
    notes: str | None = None


class PropFirmRequest(BaseModel):
    daily_returns: list[float] = Field(min_length=30)
    starting_equity: float = Field(default=10_000, gt=0)
    profit_target_pct: float = Field(default=10.0, gt=0)
    max_drawdown_pct: float = Field(default=10.0, gt=0)
    max_daily_drawdown_pct: float = Field(default=5.0, gt=0)
    days: int = Field(default=30, ge=5, le=365)
    n_sims: int = Field(default=2000, ge=100, le=20000)
    seed: int | None = None


class PropFirmResponse(BaseModel):
    pass_rate: float
    fail_rate: float
    breakeven_rate: float
    details: dict[str, Any]


class BootstrapRequest(BaseModel):
    series: list[float] = Field(min_length=10)
    statistic: Literal["mean", "median"] = "mean"
    confidence_level: float = Field(default=0.95, ge=0.5, le=0.999)
    n_resamples: int = Field(default=10000, ge=100, le=200000)
    seed: int | None = None


class BootstrapResponse(BaseModel):
    statistic: str
    estimate: float
    ci_low: float
    ci_high: float


class QuantCopilotChatRequest(BaseModel):
    message: str = Field(min_length=1)


class QuantCopilotChatResponse(BaseModel):
    reply: str
    backend: str
    model: str | None = None
