from __future__ import annotations

import os


class Settings:
    def __init__(self) -> None:
        self.gemini_api_key: str = os.environ["GEMINI_API_KEY"]


_settings: Settings | None = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
