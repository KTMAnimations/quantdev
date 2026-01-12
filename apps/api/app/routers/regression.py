from fastapi import APIRouter

from app.models.schemas import RegressionRequest, RegressionResponse
from app.services.regression_service import RegressionService

router = APIRouter()


@router.post("/analyze", response_model=RegressionResponse)
async def analyze(request: RegressionRequest) -> RegressionResponse:
    service = RegressionService()
    result = await service.analyze(
        returns=request.returns,
        factors=request.factors,
    )
    return RegressionResponse(**result)

