from fastapi import APIRouter

from app.models.schemas import PineGenerateRequest, PineGenerateResponse
from app.services.pine_generator import PineGeneratorService

router = APIRouter()


@router.post("/generate", response_model=PineGenerateResponse)
async def generate(request: PineGenerateRequest) -> PineGenerateResponse:
    service = PineGeneratorService()
    result = await service.generate(
        description=request.description,
        kind=request.kind,
    )
    return PineGenerateResponse(**result)

