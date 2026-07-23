"use client";

import { useState } from "react";

type JudgeScore = {
  judge: string;
  score: number;
  comment: string;
};

type JudgeResponse = {
  total_score: number;
  judges: JudgeScore[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [odai, setOdai] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<JudgeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!odai.trim() || !answer.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/judge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odai, answer }),
      });

      if (!res.ok) {
        throw new Error("採点に失敗しました");
      }

      const data: JudgeResponse = await res.json();
      setResult(data);
    } catch {
      setError("採点中にエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-6">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
            BOKE MASTER
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            AI審査員5人があなたの大喜利を採点します
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="odai"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              お題
            </label>
            <input
              id="odai"
              value={odai}
              onChange={(e) => setOdai(e.target.value)}
              placeholder="例：こんな寿司屋は嫌だ"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="answer"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              回答
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="あなたの大喜利回答を入力してください"
              rows={4}
              className="resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-full bg-black px-5 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isLoading ? "採点中..." : "採点してもらう"}
          </button>
        </form>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        {result && (
          <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">合計点</p>
              <p className="text-4xl font-bold text-black dark:text-zinc-50">
                {result.total_score}
                <span className="text-lg font-normal text-zinc-500 dark:text-zinc-400">
                  {" "}
                  / 50
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
        )}
      </main>
    </div>
  );
}
