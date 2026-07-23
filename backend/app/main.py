from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.judge import router as judge_router
from app.core.constants import ALLOWED_ORIGINS, API_V1_PREFIX
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    configure_logging()

    app = FastAPI(title="BOKE MASTER API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(judge_router, prefix=API_V1_PREFIX)

    return app


app = create_app()
