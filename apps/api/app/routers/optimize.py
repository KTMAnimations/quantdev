from fastapi import APIRouter

from app.models.schemas import RegressionRequest, RegressionResponse
from app.services.regression_service import RegressionService

router = APIRouter(prefix="/optimize")


@router.post("/regression", response_model=RegressionResponse)
async def regression(request: RegressionRequest) -> RegressionResponse:
    service = RegressionService()
    result = await service.analyze(returns=request.returns, factors=request.factors)
    return RegressionResponse(**result)

