from abc import ABC, abstractmethod

from app.schemas.judge import JudgeScore


class BaseAIGateway(ABC):
    @abstractmethod
    def judge(self, odai: str, answer: str) -> list[JudgeScore]:
        raise NotImplementedError
