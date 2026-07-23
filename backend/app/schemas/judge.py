from pydantic import BaseModel


class JudgeRequest(BaseModel):
    odai: str
    answer: str


class JudgeScore(BaseModel):
    judge: str
    score: int
    comment: str


class JudgeResult(BaseModel):
    id: str
    odai: str
    answer: str
    total_score: int
    judges: list[JudgeScore]


class JudgeResponse(BaseModel):
    id: str
    total_score: int
    judges: list[JudgeScore]
