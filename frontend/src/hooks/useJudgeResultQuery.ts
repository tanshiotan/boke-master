"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchJudgeResult } from "@/lib/api";

export function useJudgeResultQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ["judge", id],
    queryFn: () => fetchJudgeResult(id),
  });
}
