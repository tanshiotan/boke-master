from fastapi.testclient import TestClient

from app.api.dependencies import get_judge_service
from app.gateways.base import BaseAIGateway
from app.main import app
from app.repositories.in_memory import InMemoryJudgeRepository
from app.schemas.judge import JudgeScore
from app.services.judge_service import JudgeService


class FakeGateway(BaseAIGateway):
    def judge(self, odai: str, answer: str) -> list[JudgeScore]:
        return [
            JudgeScore(judge="審査員A", score=8, comment="面白い"),
            JudgeScore(judge="審査員B", score=6, comment="まあまあ"),
        ]


def build_client() -> TestClient:
    service = JudgeService(
        gateway=FakeGateway(),
        repository=InMemoryJudgeRepository(),
    )
    app.dependency_overrides[get_judge_service] = lambda: service
    return TestClient(app)


def teardown_function() -> None:
    app.dependency_overrides.clear()


def test_create_judgement_returns_total_and_judges():
    client = build_client()

    response = client.post(
        "/api/v1/judge",
        json={"odai": "こんな寿司屋は嫌だ", "answer": "ネタが全部わさび"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_score"] == 14
    assert len(data["judges"]) == 2
    assert data["id"]


def test_get_judgement_roundtrip():
    client = build_client()

    created = client.post(
        "/api/v1/judge",
        json={"odai": "お題", "answer": "回答"},
    ).json()

    fetched = client.get(f"/api/v1/judge/{created['id']}")

    assert fetched.status_code == 200
    assert fetched.json()["id"] == created["id"]


def test_get_judgement_not_found():
    client = build_client()

    response = client.get("/api/v1/judge/does-not-exist")

    assert response.status_code == 404
