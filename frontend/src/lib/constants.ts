// 既定は空文字で同一オリジンへ送りnext.config.tsのrewritesでFastAPIへ中継する
// NEXT_PUBLIC_API_URLを設定した場合はプロキシを介さず直接そのURLへ送る
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API_V1_PREFIX = "/api/v1";

export const MAX_TOTAL_SCORE = 50;

export const MAX_JUDGE_SCORE = 10;

export const JUDGE_REVEAL_INTERVAL_MS = 450;

export const ODAI_LIST = [
  "こんな寿司屋は嫌だ",
  "宇宙人が地球に来て最初に言った一言",
  "使いにくすぎる目覚まし時計の機能とは",
  "こんな学校の校則は嫌だ",
] as const;
