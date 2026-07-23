"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useJudge } from "@/hooks/useJudge";
import { MAX_TOTAL_SCORE } from "@/lib/constants";
import type { JudgeResult } from "@/types/judge";

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const { loadResult, isLoading, error } = useJudge();
  const [result, setResult] = useState<JudgeResult | null>(null);

  useEffect(() => {
    let active = true;
    loadResult(params.id).then((data) => {
      if (active) setResult(data);
    });
    return () => {
      active = false;
    };
  }, [params.id, loadResult]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6">
        {isLoading && (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            読み込み中...
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        {result && (
          <>
            <header className="text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">お題</p>
              <h1 className="mt-1 text-xl font-semibold text-black dark:text-zinc-50">
                {result.odai}
              </h1>
              <p className="mt-3 rounded-lg bg-white px-4 py-3 text-black shadow-sm dark:bg-zinc-900 dark:text-zinc-50">
                {result.answer}
              </p>
            </header>

            <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
              <div className="text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">合計点</p>
                <p className="text-4xl font-bold text-black dark:text-zinc-50">
                  {result.total_score}
                  <span className="text-lg font-normal text-zinc-500 dark:text-zinc-400">
                    {" "}
                    / {MAX_TOTAL_SCORE}
                  </span>
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {result.judges.map((j) => (
                  <li
                    key={j.judge}
                    className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black dark:text-zinc-50">
                        {j.judge}
                      </span>
                      <span className="font-semibold text-black dark:text-zinc-50">
                        {j.score} / 10
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {j.comment}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href="/"
              className="self-center rounded-full border border-zinc-300 px-6 py-2 font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              もう一度挑戦する
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
