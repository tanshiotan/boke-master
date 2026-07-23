import json
from types import SimpleNamespace

from fastapi.testclient import TestClient

import main


def test_judge_boke_returns_total_score_and_judges(monkeypatch):
    fake_response_text = json.dumps(
        {
            "judges": [
                {"judge": "審査員A", "score": 8, "comment": "面白い"},
                {"judge": "審査員B", "score": 6, "comment": "まあまあ"},
            ]
        }
    )

    def fake_generate_content(**kwargs):
        return SimpleNamespace(text=fake_response_text)

    monkeypatch.setattr(main.client.models, "generate_content", fake_generate_content)

    client = TestClient(main.app)
    response = client.post(
        "/api/judge",
        json={"odai": "こんな寿司屋は嫌だ", "answer": "ネタが全部わさび"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_score"] == 14
    assert len(data["judges"]) == 2


def test_judge_boke_returns_502_on_invalid_json(monkeypatch):
    def fake_generate_content(**kwargs):
        return SimpleNamespace(text="not a json")

    monkeypatch.setattr(main.client.models, "generate_content", fake_generate_content)

    client = TestClient(main.app)
    response = client.post(
        "/api/judge",
        json={"odai": "こんな寿司屋は嫌だ", "answer": "ネタが全部わさび"},
    )

    assert response.status_code == 502
