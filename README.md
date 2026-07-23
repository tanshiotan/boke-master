# BOKE MASTER

AIを活用した大喜利採点アプリです。お題に対する回答を送信すると、5人のAI審査員が採点しコメントを返します。

## 技術スタック

- バックエンド: Python 3.12 / FastAPI / google-genai (Gemini) / slowapi
- フロントエンド: TypeScript / Next.js (App Router) / Tailwind CSS
- パッケージ管理: backend は pip、frontend は npm

## ディレクトリ構成

```
boke-master/
├── backend/    FastAPI（多層アーキテクチャ: api / services / gateways / repositories / core）
└── frontend/   Next.js（App Router）
```

## ローカル起動手順

### バックエンド（FastAPI）

```bash
cd backend
python3 -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # GEMINI_API_KEY を設定
uvicorn app.main:app --reload --env-file .env --port 8000
```

### フロントエンド（Next.js）

```bash
cd frontend
npm install
npm run dev                          # http://localhost:3000
```

## 環境変数

| 変数 | 説明 | デフォルト |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini APIキー（本番採点時に必須） | なし |
| `USE_MOCK_AI` | `true` でモックAIに切り替え | `false` |
| `RATE_LIMIT_PER_MINUTE` | 同一IPあたりの1分間の採点回数上限 | `10` |

## モックモード（USE_MOCK_AI=true）

`.env` に `USE_MOCK_AI=true` を設定すると、Gemini APIを呼び出さずに固定の採点結果を0秒で返します。APIキーを消費せずにUIや画面遷移の動作確認ができます。

```bash
USE_MOCK_AI=true uvicorn app.main:app --reload --port 8000
```

## 開発コマンド

### バックエンド

```bash
cd backend
make fmt        # ruff format による自動整形
make lint       # ruff check と pytest を実行
make openapi    # openapi.json を出力
```

### フロントエンド

```bash
cd frontend
npm run lint    # eslint
npx tsc --noEmit
```

## OpenAPI 型同期

バックエンドのスキーマからフロントエンドの型を生成できます。

```bash
cd backend && make openapi                                  # backend/openapi.json を生成
cd frontend && npx openapi-typescript ../backend/openapi.json -o src/types/schema.ts
```

## ライセンス

MIT License
