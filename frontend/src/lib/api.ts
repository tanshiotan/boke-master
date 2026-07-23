import { API_BASE_URL, API_V1_PREFIX } from "@/lib/constants";
import type { JudgeResponse, JudgeResult } from "@/types/judge";

const buildUrl = (path: string) => `${API_BASE_URL}${API_V1_PREFIX}${path}`;

export async function postJudge(
  odai: string,
  answer: string,
  token?: string | null,
): Promise<JudgeResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl("/judge"), {
    method: "POST",
    headers,
    body: JSON.stringify({ odai, answer }),
  });

  if (!res.ok) {
    throw new Error("採点に失敗しました");
  }

  return res.json();
}

export async function fetchJudgeResult(id: string): Promise<JudgeResult> {
  const res = await fetch(buildUrl(`/judge/${id}`));

  if (!res.ok) {
    throw new Error("結果の取得に失敗しました");
  }

  return res.json();
}
