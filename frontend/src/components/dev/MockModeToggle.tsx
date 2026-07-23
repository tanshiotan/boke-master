"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

import { Icon } from "@/components/common/Icon";
import {
  getMockModeServerSnapshot,
  isMockModeEnabled,
  setMockModeEnabled,
  subscribeMockMode,
} from "@/lib/mockMode";
import { notifySuccess } from "@/lib/toast";

const MOCK_LABEL = "モックAPI";

const REAL_LABEL = "実API";

const MOCK_ENABLED_MESSAGE = "モックAPIに切り替えました";

const MOCK_DISABLED_MESSAGE = "実APIに切り替えました";

export function MockModeToggle() {
  const queryClient = useQueryClient();
  const isEnabled = useSyncExternalStore(
    subscribeMockMode,
    isMockModeEnabled,
    getMockModeServerSnapshot,
  );

  const handleToggle = () => {
    const nextEnabled = !isEnabled;
    setMockModeEnabled(nextEnabled);
    // 切替前の取得結果が残らないようキャッシュを破棄する
    queryClient.clear();
    notifySuccess(nextEnabled ? MOCK_ENABLED_MESSAGE : MOCK_DISABLED_MESSAGE);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isEnabled}
      title="開発用の通信先切替 本番ビルドでは表示されない"
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-colors ${
        isEnabled
          ? "bg-amber-500 text-black hover:bg-amber-400"
          : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
      }`}
    >
      <Icon name={isEnabled ? "flask" : "antenna"} size={16} />
      {isEnabled ? MOCK_LABEL : REAL_LABEL}
    </button>
  );
}
