from __future__ import annotations

from datetime import date
from typing import Any


class BacktestService:
    async def run(
        self,
        symbol: str,
        timeframe: str,
        start_date: date,
        end_date: date,
        initial_capital: float,
        trades: list[Any],
    ) -> dict:
        # Placeholder implementation: accepts precomputed trades from the frontend.
        equity = initial_capital
        equity_curve: list[dict[str, Any]] = [{"t": start_date.isoformat(), "equity": equity}]
        wins = 0
        losses = 0
        peak = equity
        max_dd = 0.0

        trades_out = []
        for trade in trades:
            pnl = float(trade.pnl)
            equity += pnl
            peak = max(peak, equity)
            dd = (peak - equity) / peak if peak > 0 else 0.0
            max_dd = max(max_dd, dd)

            if pnl >= 0:
                wins += 1
            else:
                losses += 1

            trades_out.append(
                {
                    "entry_date": trade.entry_date.isoformat(),
                    "exit_date": trade.exit_date.isoformat(),
                    "pnl": pnl,
                }
            )
            equity_curve.append({"t": trade.exit_date.isoformat(), "equity": equity})

        total_trades = len(trades_out)
        win_rate = wins / total_trades if total_trades else 0.0
        total_return = (equity / initial_capital) - 1 if initial_capital else 0.0

        return {
            "symbol": symbol,
            "timeframe": timeframe,
            "start_date": start_date,
            "end_date": end_date,
            "initial_capital": initial_capital,
            "total_return": float(total_return),
            "max_drawdown": float(max_dd),
            "win_rate": float(win_rate),
            "total_trades": int(total_trades),
            "equity_curve": equity_curve,
            "trades": trades_out,
        }

