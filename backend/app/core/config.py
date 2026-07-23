from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.constants import DEFAULT_ALLOWED_ORIGINS, ORIGIN_SEPARATOR


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gemini_api_key: str | None = None
    use_mock_ai: bool = False
    rate_limit_per_minute: int = 10
    allowed_origins: str | None = None
    frontend_url: str | None = None

    @property
    def cors_origins(self) -> list[str]:
        raw = self.allowed_origins or self.frontend_url
        if raw is None:
            return list(DEFAULT_ALLOWED_ORIGINS)

        origins = [origin.strip() for origin in raw.split(ORIGIN_SEPARATOR) if origin.strip()]
        return origins or list(DEFAULT_ALLOWED_ORIGINS)


@lru_cache
def get_settings() -> Settings:
    return Settings()
