from fastapi import APIRouter

from app.core.constants import HEALTH_STATUS_OK
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return HealthResponse(status=HEALTH_STATUS_OK)
