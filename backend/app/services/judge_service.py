from __future__ import annotations

import uuid

from app.gateways.base import BaseAIGateway
from app.repositories.base import BaseJudgeRepository
from app.schemas.judge import JudgeResult


class JudgeService:
    def __init__(self, gateway: BaseAIGateway, repository: BaseJudgeRepository) -> None:
        self._gateway = gateway
        self._repository = repository

    def judge(self, odai: str, answer: str) -> JudgeResult:
        scores = self._gateway.judge(odai, answer)
        total_score = sum(score.score for score in scores)

        result = JudgeResult(
            id=uuid.uuid4().hex,
            odai=odai,
            answer=answer,
            total_score=total_score,
            judges=scores,
        )
        self._repository.save(result)
        return result

    def get_result(self, result_id: str) -> JudgeResult | None:
        return self._repository.get(result_id)
