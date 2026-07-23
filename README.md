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
| `ALLOWED_ORIGINS` | CORSで許可するオリジン（カンマ区切り） | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | フロントエンドが参照するバックエンドのURL | `http://localhost:8000` |

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

## Renderへのデプロイ

リポジトリ直下の `render.yaml` に、バックエンドとフロントエンドの2サービス分の設定をまとめています。Render のダッシュボードで **New → Blueprint** を選び、このリポジトリを指定すると2つの Web Service が同時に作成されます。

作成後、以下の3つの環境変数だけは Render の画面から手動で設定してください（値がシークレット、または相手側のURLが確定してから決まるため）。

| サービス | 変数 | 設定する値 |
| --- | --- | --- |
| boke-master-api | `GEMINI_API_KEY` | Gemini APIキー |
| boke-master-api | `ALLOWED_ORIGINS` | フロントエンドのURL（例: `https://boke-master-web.onrender.com`） |
| boke-master-web | `NEXT_PUBLIC_API_URL` | バックエンドのURL（例: `https://boke-master-api.onrender.com`） |

### 注意点

- `ALLOWED_ORIGINS` は末尾のスラッシュを付けないでください。完全一致で比較するため、付いているとCORSエラーになります。
- `NEXT_PUBLIC_API_URL` はビルド時にコードへ埋め込まれます。値を変更したら **Clear build cache & deploy** で再ビルドしてください。
- 無料プランでは15分アクセスがないとサービスが停止し、次回アクセス時の起動に30〜60秒かかります。
- バックエンドの疎通確認は `https://<バックエンドのURL>/health` で行えます。

## ライセンス

MIT License
