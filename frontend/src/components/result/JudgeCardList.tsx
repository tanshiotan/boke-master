import { JUDGE_REVEAL_INTERVAL_MS, MAX_JUDGE_SCORE } from "@/lib/constants";
import type { JudgeScore } from "@/types/judge";

export function JudgeCardList({ judges }: { judges: JudgeScore[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {judges.map((judge, index) => (
        <li
          key={judge.judge}
          className="judge-card rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          style={{ animationDelay: `${index * JUDGE_REVEAL_INTERVAL_MS}ms` }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-black dark:text-zinc-50">
              {judge.judge}
            </span>
            <span className="font-semibold text-black dark:text-zinc-50">
              {judge.score} / {MAX_JUDGE_SCORE}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {judge.comment}
          </p>
        </li>
      ))}
    </ul>
  );
}
