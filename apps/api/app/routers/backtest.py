from fastapi import APIRouter

from app.models.schemas import BacktestRequest, BacktestResponse
from app.services.backtest_service import BacktestService

router = APIRouter()


@router.post("/run", response_model=BacktestResponse)
async def run_backtest(request: BacktestRequest) -> BacktestResponse:
    service = BacktestService()
    result = await service.run(
        symbol=request.symbol,
        timeframe=request.timeframe,
        start_date=request.start_date,
        end_date=request.end_date,
        initial_capital=request.initial_capital,
        trades=request.trades,
    )
    return BacktestResponse(**result)

