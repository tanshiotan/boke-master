from __future__ import annotations

from app.repositories.base import BaseJudgeRepository
from app.schemas.judge import JudgeResult


class InMemoryJudgeRepository(BaseJudgeRepository):
    def __init__(self) -> None:
        self._store: dict[str, JudgeResult] = {}

    def save(self, result: JudgeResult) -> None:
        self._store[result.id] = result

    def get(self, result_id: str) -> JudgeResult | None:
        return self._store.get(result_id)
