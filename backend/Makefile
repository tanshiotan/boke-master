.PHONY: fmt fmt-check lint test openapi

fmt:
	ruff format .

fmt-check:
	ruff format --check .

lint:
	ruff check .
	pytest

test:
	pytest

openapi:
	USE_MOCK_AI=true python scripts/export_openapi.py
