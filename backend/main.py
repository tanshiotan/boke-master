import json
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel

app = FastAPI(title="BOKE MASTER API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

JUDGES = [
    "松本人志風の毒舌審査員",
    "上沼恵美子風の辛口だが的確な審査員",
    "若手芸人目線のフレッシュな審査員",
    "放送作家目線の構成・言葉選びに厳しい審査員",
    "一般視聴者目線の素直な審査員",
]


class JudgeRequest(BaseModel):
    odai: str
    answer: str


class JudgeScore(BaseModel):
    judge: str
    score: int
    comment: str


class JudgeResponse(BaseModel):
    total_score: int
    judges: list[JudgeScore]


@app.post("/api/judge", response_model=JudgeResponse)
def judge_boke(request: JudgeRequest) -> JudgeResponse:
    prompt = f"""あなたは大喜利の審査員団です。以下の5人の審査員それぞれの視点で、
お題に対する回答を10点満点で採点し、短いコメントを付けてください。

審査員一覧:
{chr(10).join(f"- {name}" for name in JUDGES)}

お題: {request.odai}
回答: {request.answer}

以下のJSON形式のみで出力してください（説明文は不要）:
{{
  "judges": [
    {{"judge": "審査員名", "score": 0から10の整数, "comment": "短評"}},
    ...
  ]
}}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    try:
        data = json.loads(response.text)
        judges = [JudgeScore(**j) for j in data["judges"]]
    except (json.JSONDecodeError, KeyError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="採点結果の解析に失敗しました") from exc

    total_score = sum(j.score for j in judges)
    return JudgeResponse(total_score=total_score, judges=judges)
