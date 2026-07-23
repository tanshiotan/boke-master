from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas.judge import JudgeResult


class BaseJudgeRepository(ABC):
    @abstractmethod
    def save(self, result: JudgeResult) -> None:
        raise NotImplementedError

    @abstractmethod
    def get(self, result_id: str) -> JudgeResult | None:
        raise NotImplementedError
