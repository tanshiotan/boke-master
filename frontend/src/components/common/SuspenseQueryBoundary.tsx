"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

type SuspenseQueryBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: (reset: () => void) => ReactNode;
};

export function SuspenseQueryBoundary({
  children,
  fallback = null,
  errorFallback,
}: SuspenseQueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) =>
            errorFallback ? (
              errorFallback(resetErrorBoundary)
            ) : (
              <DefaultErrorFallback onReset={resetErrorBoundary} />
            )
          }
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function DefaultErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 p-6 text-center dark:border-red-900">
      <p className="text-sm text-red-600 dark:text-red-400">
        データの取得に失敗しました
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        再試行する
      </button>
    </div>
  );
}
