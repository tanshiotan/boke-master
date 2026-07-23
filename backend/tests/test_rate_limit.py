from fastapi.testclient import TestClient

from app.api.dependencies import get_judge_service
from app.core.config import Settings
from app.core.rate_limit import limiter
from app.gateways.mock import MockAIGateway
from app.main import app
from app.repositories.in_memory import InMemoryJudgeRepository
from app.services.judge_service import JudgeService

RATE_LIMIT = 3


def build_client() -> TestClient:
    service = JudgeService(
        gateway=MockAIGateway(),
        repository=InMemoryJudgeRepository(),
    )
    app.dependency_overrides[get_judge_service] = lambda: service
    return TestClient(app)


def teardown_function() -> None:
    app.dependency_overrides.clear()
    limiter.enabled = False


def test_rate_limit_blocks_excess_requests(monkeypatch):
    monkeypatch.setattr(
        "app.core.rate_limit.get_settings",
        lambda: Settings(use_mock_ai=True, rate_limit_per_minute=RATE_LIMIT),
    )
    limiter.enabled = True

    client = build_client()
    payload = {"odai": "お題", "answer": "回答"}

    statuses = [
        client.post("/api/v1/judge", json=payload).status_code for _ in range(RATE_LIMIT + 2)
    ]

    assert statuses[:RATE_LIMIT] == [200] * RATE_LIMIT
    assert 429 in statuses[RATE_LIMIT:]
