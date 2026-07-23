.PHONY: fmt lint test openapi

fmt:
	ruff format .

lint:
	ruff check .
	pytest

test:
	pytest

openapi:
	USE_MOCK_AI=true python scripts/export_openapi.py
