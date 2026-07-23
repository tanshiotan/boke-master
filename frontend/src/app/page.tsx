"use client";

import { useRouter } from "next/navigation";

import { ODAI_LIST } from "@/lib/constants";

export default function Home() {
  const router = useRouter();

  const handleChallenge = () => {
    const odai = ODAI_LIST[Math.floor(Math.random() * ODAI_LIST.length)];
    router.push(`/play?odai=${encodeURIComponent(odai)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            BOKE MASTER
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            AI審査員5人があなたの大喜利を採点します
          </p>
        </header>

        <section className="w-full rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            ボタンを押すとお題が出されます
          </p>
          <p className="mt-3 text-2xl font-semibold text-black dark:text-zinc-50">
            準備はいいですか？
          </p>
        </section>

        <button
          type="button"
          onClick={handleChallenge}
          className="rounded-full bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          挑戦する
        </button>
      </main>
    </div>
  );
}
