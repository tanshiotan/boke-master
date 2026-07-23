"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { SuspenseQueryBoundary } from "@/components/common/SuspenseQueryBoundary";
import { JudgeCardList } from "@/components/result/JudgeCardList";
import { useJudgeResultQuery } from "@/hooks/useJudgeResultQuery";
import { MAX_TOTAL_SCORE } from "@/lib/constants";
import { notifyError } from "@/lib/toast";

export default function ResultPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6">
        <SuspenseQueryBoundary
          fallback={<LoadingView />}
          errorFallback={(reset) => <ResultErrorView onRetry={reset} />}
        >
          <ResultContent id={params.id} />
        </SuspenseQueryBoundary>
      </main>
    </div>
  );
}

function ResultContent({ id }: { id: string }) {
  const { data: result } = useJudgeResultQuery(id);

  return (
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

        <JudgeCardList judges={result.judges} />
      </section>

      <Link
        href="/"
        className="self-center rounded-full border border-zinc-300 px-6 py-2 font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        もう一度挑戦する
      </Link>
    </>
  );
}

function LoadingView() {
  return (
    <p className="text-center text-zinc-500 dark:text-zinc-400">
      審査結果を読み込み中...
    </p>
  );
}

function ResultErrorView({ onRetry }: { onRetry: () => void }) {
  useEffect(() => {
    notifyError();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        審査結果の取得に失敗しました
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          再試行する
        </button>
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
