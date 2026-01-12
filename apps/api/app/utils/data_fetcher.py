from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pandas as pd
import yfinance as yf


async def fetch_ohlcv(symbol: str, timeframe: str, lookback_days: int) -> pd.DataFrame:
    interval = _timeframe_to_yfinance_interval(timeframe)
    end = datetime.now(tz=timezone.utc)
    start = end - timedelta(days=int(lookback_days))

    df = yf.download(
        tickers=symbol,
        start=start.date().isoformat(),
        end=end.date().isoformat(),
        interval=interval,
        progress=False,
        auto_adjust=True,
    )
    if df.empty:
        raise ValueError(f"No data returned for symbol={symbol}")

    df = df.rename(
        columns={
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
            "Volume": "volume",
        }
    )
    df = df[["open", "high", "low", "close", "volume"]].copy()
    if isinstance(df.columns, pd.MultiIndex):
        tickers = df.columns.get_level_values(-1).unique()
        if len(tickers) == 1:
            df.columns = df.columns.get_level_values(0)
        else:
            df.columns = [f"{field}_{ticker}" for field, ticker in df.columns.to_list()]
    df.index.name = "timestamp"
    return df


def _timeframe_to_yfinance_interval(timeframe: str) -> str:
    tf = timeframe.strip().upper()
    if tf in {"1D", "D", "DAY"}:
        return "1d"
    if tf in {"1H", "H", "HOUR"}:
        return "60m"
    if tf in {"15M", "15MIN"}:
        return "15m"
    if tf in {"5M", "5MIN"}:
        return "5m"
    return "1d"
