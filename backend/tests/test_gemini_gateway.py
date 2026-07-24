import json
from dataclasses import dataclass, field

import pytest
from google.genai import errors

from app.core.constants import HTTP_STATUS_TOO_MANY_REQUESTS
from app.core.exceptions import AIGatewayError, JudgeParseError
from app.gateways.gemini import GeminiGateway

MODELS = ["model-a", "model-b", "model-c"]
RESPONSE_TEXT = json.dumps({"judges": [{"judge": "A", "score": 5, "comment": "ok"}]})
INVALID_REQUEST_STATUS = 400


@dataclass
class FakeResponse:
    text: str


@dataclass
class FakeModels:
    errors_by_model: dict[str, errors.ClientError]
    called_models: list[str] = field(default_factory=list)

    def generate_content(self, model: str, contents: str, config: object) -> FakeResponse:
        self.called_models.append(model)
        error = self.errors_by_model.get(model)
        if error is not None:
            raise error
        return FakeResponse(text=RESPONSE_TEXT)


@dataclass
class FakeClient:
    models: FakeModels


def make_client_error(code: int) -> errors.ClientError:
    return errors.ClientError(code, {"error": {"code": code, "message": "テスト用エラー"}})


def make_gateway() -> GeminiGateway:
    gateway = GeminiGateway.__new__(GeminiGateway)
    return gateway


def make_gateway_with_errors(
    monkeypatch: pytest.MonkeyPatch, errors_by_model: dict[str, errors.ClientError]
) -> tuple[GeminiGateway, FakeModels]:
    monkeypatch.setattr("app.gateways.gemini.GEMINI_MODELS", MODELS)
    models = FakeModels(errors_by_model=errors_by_model)
    gateway = make_gateway()
    gateway._client = FakeClient(models=models)
    return gateway, models


def test_uses_first_model_when_available(monkeypatch):
    gateway, models = make_gateway_with_errors(monkeypatch, {})

    scores = gateway.judge("お題", "回答")

    assert models.called_models == [MODELS[0]]
    assert len(scores) == 1


def test_falls_back_to_next_model_on_rate_limit(monkeypatch):
    rate_limited = {MODELS[0]: make_client_error(HTTP_STATUS_TOO_MANY_REQUESTS)}
    gateway, models = make_gateway_with_errors(monkeypatch, rate_limited)

    scores = gateway.judge("お題", "回答")

    assert models.called_models == [MODELS[0], MODELS[1]]
    assert len(scores) == 1


def test_raises_when_all_models_rate_limited(monkeypatch):
    rate_limited = {model: make_client_error(HTTP_STATUS_TOO_MANY_REQUESTS) for model in MODELS}
    gateway, models = make_gateway_with_errors(monkeypatch, rate_limited)

    with pytest.raises(AIGatewayError):
        gateway.judge("お題", "回答")

    assert models.called_models == MODELS


def test_does_not_fall_back_on_other_client_error(monkeypatch):
    invalid_request = {MODELS[0]: make_client_error(INVALID_REQUEST_STATUS)}
    gateway, models = make_gateway_with_errors(monkeypatch, invalid_request)

    with pytest.raises(AIGatewayError):
        gateway.judge("お題", "回答")

    assert models.called_models == [MODELS[0]]


def test_parse_valid_json():
    gateway = make_gateway()
    text = json.dumps({"judges": [{"judge": "A", "score": 5, "comment": "ok"}]})

    scores = gateway._parse(text)

    assert len(scores) == 1
    assert scores[0].score == 5


def test_parse_invalid_json_raises():
    gateway = make_gateway()

    with pytest.raises(JudgeParseError):
        gateway._parse("not json")
