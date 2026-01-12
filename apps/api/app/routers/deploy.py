from fastapi import APIRouter

from app.models.schemas import PropFirmRequest, PropFirmResponse
from app.services.prop_firm_simulator import PropFirmSimulatorService

router = APIRouter(prefix="/deploy")


@router.post("/prop-sim", response_model=PropFirmResponse)
async def prop_sim(request: PropFirmRequest) -> PropFirmResponse:
    service = PropFirmSimulatorService()
    result = await service.simulate(
        daily_returns=request.daily_returns,
        starting_equity=request.starting_equity,
        profit_target_pct=request.profit_target_pct,
        max_drawdown_pct=request.max_drawdown_pct,
        max_daily_drawdown_pct=request.max_daily_drawdown_pct,
        days=request.days,
        n_sims=request.n_sims,
        seed=request.seed,
    )
    return PropFirmResponse(**result)

