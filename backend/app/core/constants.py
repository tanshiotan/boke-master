JUDGES: list[str] = [
    "松本人志風の毒舌審査員",
    "上沼恵美子風の辛口だが的確な審査員",
    "若手芸人目線のフレッシュな審査員",
    "放送作家目線の構成・言葉選びに厳しい審査員",
    "一般視聴者目線の素直な審査員",
]

SCORE_MIN: int = 0
SCORE_MAX: int = 10

MOCK_SCORE: int = 8
MOCK_COMMENT: str = "モック審査員による固定コメントです"

# 上から順に試行し利用不可なら次のモデルへフォールバックする
GEMINI_MODELS: list[str] = [
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
]

HTTP_STATUS_TOO_MANY_REQUESTS: int = 429
HTTP_STATUS_NOT_FOUND: int = 404

# 利用制限とモデル未提供はAPIキーごとに異なるため次のモデルで再試行する
GEMINI_FALLBACK_STATUSES: frozenset[int] = frozenset(
    {HTTP_STATUS_TOO_MANY_REQUESTS, HTTP_STATUS_NOT_FOUND}
)

COMMENT_MAX_LENGTH: int = 20

DEFAULT_ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
ORIGIN_SEPARATOR: str = ","

HEALTH_STATUS_OK: str = "ok"

API_V1_PREFIX: str = "/api/v1"
