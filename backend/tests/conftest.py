import os

os.environ.setdefault("GEMINI_API_KEY", "dummy-key-for-tests")

from app.core.rate_limit import limiter  # noqa: E402

limiter.enabled = False
