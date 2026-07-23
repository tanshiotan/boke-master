from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gemini_api_key: str | None = None
    use_mock_ai: bool = False
    rate_limit_per_minute: int = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()
