from app.core.config import Settings
from app.core.constants import DEFAULT_ALLOWED_ORIGINS

PRODUCTION_ORIGIN = "https://boke-master.onrender.com"
PREVIEW_ORIGIN = "https://preview.example.com"


def build_settings(allowed_origins: str | None = None, frontend_url: str | None = None) -> Settings:
    return Settings(allowed_origins=allowed_origins, frontend_url=frontend_url)


def test_defaults_to_localhost_when_unset():
    settings = build_settings()

    assert settings.cors_origins == DEFAULT_ALLOWED_ORIGINS


def test_parses_comma_separated_origins():
    settings = build_settings(allowed_origins=f"{PRODUCTION_ORIGIN},{PREVIEW_ORIGIN}")

    assert settings.cors_origins == [PRODUCTION_ORIGIN, PREVIEW_ORIGIN]


def test_trims_whitespace_and_drops_empty_entries():
    settings = build_settings(allowed_origins=f" {PRODUCTION_ORIGIN} , , {PREVIEW_ORIGIN} ")

    assert settings.cors_origins == [PRODUCTION_ORIGIN, PREVIEW_ORIGIN]


def test_falls_back_to_frontend_url():
    settings = build_settings(frontend_url=PRODUCTION_ORIGIN)

    assert settings.cors_origins == [PRODUCTION_ORIGIN]


def test_allowed_origins_takes_priority_over_frontend_url():
    settings = build_settings(allowed_origins=PRODUCTION_ORIGIN, frontend_url=PREVIEW_ORIGIN)

    assert settings.cors_origins == [PRODUCTION_ORIGIN]


def test_blank_value_falls_back_to_default():
    settings = build_settings(allowed_origins="  ,  ")

    assert settings.cors_origins == DEFAULT_ALLOWED_ORIGINS
