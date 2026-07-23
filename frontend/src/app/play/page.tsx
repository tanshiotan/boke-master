"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { useJudge } from "@/hooks/useJudge";
import { ODAI_LIST } from "@/lib/constants";
import { notifyError } from "@/lib/toast";

function PlayForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const odai = searchParams.get("odai") ?? ODAI_LIST[0];

  const { submitJudge, isLoading, error } = useJudge();
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const response = await submitJudge(odai, answer);
    if (response) {
      router.push(`/result/${response.id}`);
      return;
    }
    notifyError();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6">
        <header className="text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">お題</p>
          <h1 className="mt-2 text-2xl font-semibold text-black dark:text-zinc-50">
            {odai}
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
        >
          <label
            htmlFor="answer"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            あなたのボケ
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="回答を入力してください"
            rows={4}
            className="resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-black px-5 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isLoading ? "採点中..." : "採点してもらう"}
          </button>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <PlayForm />
    </Suspense>
  );
}
