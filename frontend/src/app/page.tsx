import Link from "next/link";

import { Icon } from "@/components/common/Icon";
import { ODAI_LIST } from "@/lib/constants";
import { pickRandomOdai } from "@/lib/odai";

export const dynamic = "force-dynamic";

export default function Home() {
  const odai = pickRandomOdai(ODAI_LIST);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <header>
          <h1 className="flex items-center justify-center gap-2 text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            <Icon name="trophy" size={32} />
            BOKE MASTER
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            AI審査員5人があなたの大喜利を採点します
          </p>
        </header>

        <section className="w-full rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">今回のお題</p>
          <p className="mt-3 text-2xl font-semibold text-black dark:text-zinc-50">
            {odai}
          </p>
        </section>

        <Link
          href={`/play?odai=${encodeURIComponent(odai)}`}
          className="flex items-center gap-2 rounded-full bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <Icon name="pen" size={16} />
          挑戦する
        </Link>
      </main>
    </div>
  );
}
