from __future__ import annotations

from functools import lru_cache

from app.core.config import Settings, get_settings
from app.core.exceptions import ConfigError
from app.gateways.base import BaseAIGateway
from app.gateways.gemini import GeminiGateway
from app.gateways.mock import MockAIGateway
from app.repositories.in_memory import InMemoryJudgeRepository
from app.services.judge_service import JudgeService


def build_ai_gateway(settings: Settings) -> BaseAIGateway:
    if settings.use_mock_ai:
        return MockAIGateway()
    if not settings.gemini_api_key:
        raise ConfigError()
    return GeminiGateway(api_key=settings.gemini_api_key)


@lru_cache
def get_judge_service() -> JudgeService:
    settings = get_settings()
    gateway = build_ai_gateway(settings)
    repository = InMemoryJudgeRepository()
    return JudgeService(gateway=gateway, repository=repository)
