from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    backtest,
    ideation,
    monte_carlo,
    pine_gen,
    prop_firm,
    regression,
)


def create_app() -> FastAPI:
    api = FastAPI(title="OpenQuant API", version="0.1.0")

    api.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api.include_router(ideation.router, prefix="/ideation", tags=["ideation"])
    api.include_router(backtest.router, prefix="/backtest", tags=["backtest"])
    api.include_router(monte_carlo.router, prefix="/monte-carlo", tags=["monte-carlo"])
    api.include_router(regression.router, prefix="/regression", tags=["regression"])
    api.include_router(pine_gen.router, prefix="/pine", tags=["pine"])
    api.include_router(prop_firm.router, prefix="/prop-firm", tags=["prop-firm"])

    @api.get("/health")
    async def health() -> dict:
        return {"ok": True}

    return api


app = create_app()

