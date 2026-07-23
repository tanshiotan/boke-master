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

GEMINI_MODEL: str = "gemini-flash-latest"

ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

API_V1_PREFIX: str = "/api/v1"
