from functools import lru_cache

from app.core.config import get_settings
from app.gateways.gemini import GeminiGateway
from app.repositories.in_memory import InMemoryJudgeRepository
from app.services.judge_service import JudgeService


@lru_cache
def get_judge_service() -> JudgeService:
    settings = get_settings()
    gateway = GeminiGateway(api_key=settings.gemini_api_key)
    repository = InMemoryJudgeRepository()
    return JudgeService(gateway=gateway, repository=repository)
