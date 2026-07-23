import json

import pytest

from app.core.exceptions import JudgeParseError
from app.gateways.gemini import GeminiGateway


def make_gateway() -> GeminiGateway:
    gateway = GeminiGateway.__new__(GeminiGateway)
    return gateway


def test_parse_valid_json():
    gateway = make_gateway()
    text = json.dumps(
        {"judges": [{"judge": "A", "score": 5, "comment": "ok"}]}
    )

    scores = gateway._parse(text)

    assert len(scores) == 1
    assert scores[0].score == 5


def test_parse_invalid_json_raises():
    gateway = make_gateway()

    with pytest.raises(JudgeParseError):
        gateway._parse("not json")
