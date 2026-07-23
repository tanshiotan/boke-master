from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_judge_service
from app.schemas.judge import JudgeRequest, JudgeResponse, JudgeResult
from app.services.judge_service import JudgeService

router = APIRouter(tags=["judge"])


@router.post("/judge", response_model=JudgeResponse)
def create_judgement(
    request: JudgeRequest,
    service: JudgeService = Depends(get_judge_service),
) -> JudgeResponse:
    result = service.judge(request.odai, request.answer)
    return JudgeResponse(
        id=result.id,
        total_score=result.total_score,
        judges=result.judges,
    )


@router.get("/judge/{result_id}", response_model=JudgeResult)
def get_judgement(
    result_id: str,
    service: JudgeService = Depends(get_judge_service),
) -> JudgeResult:
    result = service.get_result(result_id)
    if result is None:
        raise HTTPException(status_code=404, detail="結果が見つかりません")
    return result
