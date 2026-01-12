from fastapi import APIRouter

from app.models.schemas import QuantCopilotChatRequest, QuantCopilotChatResponse
from app.utils.llm_client import LLMClient

router = APIRouter(prefix="/quant-copilot")


@router.post("/chat", response_model=QuantCopilotChatResponse)
async def chat(request: QuantCopilotChatRequest) -> QuantCopilotChatResponse:
    client = LLMClient()
    result = await client.chat(request.message)
    return QuantCopilotChatResponse(**result)

