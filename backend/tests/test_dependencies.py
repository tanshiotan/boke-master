import pytest

from app.api.dependencies import build_ai_gateway
from app.core.config import Settings
from app.core.constants import JUDGES, MOCK_SCORE
from app.core.exceptions import ConfigError
from app.gateways.gemini import GeminiGateway
from app.gateways.mock import MockAIGateway


def test_mock_gateway_selected_when_use_mock_ai_true():
    settings = Settings(use_mock_ai=True, gemini_api_key=None)

    gateway = build_ai_gateway(settings)

    assert isinstance(gateway, MockAIGateway)


def test_gemini_gateway_selected_when_key_present():
    settings = Settings(use_mock_ai=False, gemini_api_key="dummy")

    gateway = build_ai_gateway(settings)

    assert isinstance(gateway, GeminiGateway)


def test_config_error_when_key_missing_and_not_mock():
    settings = Settings(use_mock_ai=False, gemini_api_key=None)

    with pytest.raises(ConfigError):
        build_ai_gateway(settings)


def test_mock_gateway_returns_fixed_judges():
    scores = MockAIGateway().judge("お題", "回答")

    assert len(scores) == len(JUDGES)
    assert all(score.score == MOCK_SCORE for score in scores)
