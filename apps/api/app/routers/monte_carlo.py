from fastapi import APIRouter

from app.models.schemas import MonteCarloRequest, MonteCarloResponse
from app.services.monte_carlo_service import MonteCarloService

router = APIRouter()


@router.post("/simulate", response_model=MonteCarloResponse)
async def simulate(request: MonteCarloRequest) -> MonteCarloResponse:
    service = MonteCarloService()
    result = await service.simulate(
        equity_curve=request.equity_curve,
        n_sims=request.n_sims,
        horizon=request.horizon,
        seed=request.seed,
    )
    return MonteCarloResponse(**result)

