from __future__ import annotations

import json

from google import genai
from google.genai import types

from app.core.constants import GEMINI_MODEL, JUDGES, SCORE_MAX, SCORE_MIN
from app.core.exceptions import AIGatewayError, JudgeParseError
from app.core.logging import get_logger
from app.gateways.base import BaseAIGateway
from app.schemas.judge import JudgeScore

logger = get_logger(__name__)


class GeminiGateway(BaseAIGateway):
    def __init__(self, api_key: str) -> None:
        self._client = genai.Client(api_key=api_key)

    def judge(self, odai: str, answer: str) -> list[JudgeScore]:
        prompt = self._build_prompt(odai, answer)

        try:
            response = self._client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
        except Exception as exc:
            raise AIGatewayError() from exc

        return self._parse(response.text)

    def _build_prompt(self, odai: str, answer: str) -> str:
        judges_block = "\n".join(f"- {name}" for name in JUDGES)
        return f"""あなたは大喜利の審査員団です。以下の5人の審査員それぞれの視点で、
お題に対する回答を{SCORE_MAX}点満点で採点し、短いコメントを付けてください。

審査員一覧:
{judges_block}

お題: {odai}
回答: {answer}

以下のJSON形式のみで出力してください（説明文は不要）:
{{
  "judges": [
    {{"judge": "審査員名", "score": {SCORE_MIN}から{SCORE_MAX}の整数, "comment": "短評"}}
  ]
}}
"""

    def _parse(self, text: str | None) -> list[JudgeScore]:
        try:
            data = json.loads(text or "")
            return [JudgeScore(**item) for item in data["judges"]]
        except (json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
            raise JudgeParseError() from exc
