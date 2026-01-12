from fastapi import APIRouter

from app.models.schemas import (
    BootstrapRequest,
    BootstrapResponse,
    MonteCarloRequest,
    MonteCarloResponse,
)
from app.services.bootstrap_service import BootstrapService
from app.services.monte_carlo_service import MonteCarloService

router = APIRouter(prefix="/test")


@router.post("/monte-carlo", response_model=MonteCarloResponse)
async def monte_carlo(request: MonteCarloRequest) -> MonteCarloResponse:
    service = MonteCarloService()
    result = await service.simulate(
        equity_curve=request.equity_curve,
        n_sims=request.n_sims,
        horizon=request.horizon,
        seed=request.seed,
    )
    return MonteCarloResponse(**result)


@router.post("/bootstrap", response_model=BootstrapResponse)
async def bootstrap_validation(request: BootstrapRequest) -> BootstrapResponse:
    service = BootstrapService()
    result = await service.run(
        series=request.series,
        statistic=request.statistic,
        confidence_level=request.confidence_level,
        n_resamples=request.n_resamples,
        seed=request.seed,
    )
    return BootstrapResponse(**result)

