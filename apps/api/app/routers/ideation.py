from fastapi import APIRouter

from app.models.schemas import IdeationAnalyzeRequest, IdeationAnalyzeResponse
from app.services.edge_discovery import EdgeDiscoveryService

router = APIRouter()


@router.post("/analyze", response_model=IdeationAnalyzeResponse)
async def analyze(request: IdeationAnalyzeRequest) -> IdeationAnalyzeResponse:
    service = EdgeDiscoveryService()
    result = await service.analyze_feature(
        feature_description=request.description,
        symbol=request.symbol,
        timeframe=request.timeframe,
        lookback_days=request.lookback_days,
    )
    return IdeationAnalyzeResponse(**result)

