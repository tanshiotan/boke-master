from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


class AppError(Exception):
    status_code: int = 500
    message: str = "内部エラーが発生しました"


class AIGatewayError(AppError):
    status_code = 502
    message = "AI採点の呼び出しに失敗しました"


class JudgeParseError(AppError):
    status_code = 502
    message = "採点結果の解析に失敗しました"


class ConfigError(AppError):
    status_code = 500
    message = "サーバー設定が不正です"


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        logger.error(exc.message, exc_info=exc)
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})
