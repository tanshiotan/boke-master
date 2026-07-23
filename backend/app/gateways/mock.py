from __future__ import annotations

from app.core.constants import JUDGES, MOCK_COMMENT, MOCK_SCORE
from app.gateways.base import BaseAIGateway
from app.schemas.judge import JudgeScore


class MockAIGateway(BaseAIGateway):
    def judge(self, odai: str, answer: str) -> list[JudgeScore]:
        return [JudgeScore(judge=name, score=MOCK_SCORE, comment=MOCK_COMMENT) for name in JUDGES]
