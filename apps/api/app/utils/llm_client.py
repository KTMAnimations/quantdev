from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

import httpx


def _env_bool(name: str, default: bool = False) -> bool:
    v = os.getenv(name)
    if v is None:
        return default
    return v.strip().lower() in {"1", "true", "yes", "y", "on"}


@dataclass(frozen=True)
class LLMConfig:
    base_url: str
    model: str
    enabled: bool


class LLMClient:
    def __init__(self, config: LLMConfig | None = None) -> None:
        self._config = config or LLMConfig(
            base_url=os.getenv("LLM_BASE_URL", "http://localhost:8080").rstrip("/"),
            model=os.getenv("LLM_MODEL_NAME", "local"),
            enabled=_env_bool("USE_LOCAL_LLM", False),
        )

    async def chat(self, message: str) -> dict[str, Any]:
        if not self._config.enabled:
            return {
                "reply": "Chat backend not configured. Set USE_LOCAL_LLM=true and LLM_BASE_URL to enable.",
                "backend": "stub",
                "model": None,
            }

        # Try OpenAI-compatible endpoint first.
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self._config.base_url}/v1/chat/completions"
                resp = await client.post(
                    url,
                    json={
                        "model": self._config.model,
                        "messages": [{"role": "user", "content": message}],
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    reply = (
                        data.get("choices", [{}])[0]
                        .get("message", {})
                        .get("content", "")
                        .strip()
                    )
                    if reply:
                        return {
                            "reply": reply,
                            "backend": "openai-compatible",
                            "model": self._config.model,
                        }
        except Exception:
            pass

        # Fallback: simple /chat endpoint that returns {reply: "..."}.
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self._config.base_url}/chat"
                resp = await client.post(url, json={"message": message, "model": self._config.model})
                if resp.status_code == 200:
                    data = resp.json()
                    reply = str(data.get("reply", "")).strip()
                    if reply:
                        return {"reply": reply, "backend": "simple", "model": self._config.model}
        except Exception:
            pass

        return {
            "reply": "LLM call failed (is ChatMock running and LLM_BASE_URL correct?).",
            "backend": "error",
            "model": self._config.model,
        }

