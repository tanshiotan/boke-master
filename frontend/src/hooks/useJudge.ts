"use client";

import { useCallback, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { fetchJudgeResult, postJudge } from "@/lib/api";
import type { JudgeResponse, JudgeResult } from "@/types/judge";

type UseJudge = {
  isLoading: boolean;
  error: string | null;
  submitJudge: (odai: string, answer: string) => Promise<JudgeResponse | null>;
  loadResult: (id: string) => Promise<JudgeResult | null>;
};

export function useJudge(): UseJudge {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitJudge = useCallback(
    async (odai: string, answer: string) => {
      setIsLoading(true);
      setError(null);
      try {
        return await postJudge(odai, answer, token);
      } catch {
        setError(
          "採点中にエラーが発生しました。時間をおいて再度お試しください。",
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  const loadResult = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await fetchJudgeResult(id);
    } catch {
      setError("結果の取得に失敗しました。");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, submitJudge, loadResult };
}
