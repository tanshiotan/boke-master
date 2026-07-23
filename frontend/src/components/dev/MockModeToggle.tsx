"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

import { Icon, type IconName } from "@/components/common/Icon";
import {
  getMockModeServerSnapshot,
  isMockModeEnabled,
  setMockModeEnabled,
  subscribeMockMode,
} from "@/lib/mockMode";
import { notifySuccess } from "@/lib/toast";

const GROUP_LABEL = "通信先";

const MOCK_ENABLED_MESSAGE = "モックAPIに切り替えました";

const MOCK_DISABLED_MESSAGE = "実APIに切り替えました";

type ApiModeOption = {
  isMock: boolean;
  label: string;
  icon: IconName;
};

// 選択中がどちらか一目で分かるよう両方の選択肢を常に表示する
const API_MODE_OPTIONS: readonly ApiModeOption[] = [
  { isMock: false, label: "実API", icon: "antenna" },
  { isMock: true, label: "モックAPI", icon: "flask" },
] as const;

export function MockModeToggle() {
  const queryClient = useQueryClient();
  const isEnabled = useSyncExternalStore(
    subscribeMockMode,
    isMockModeEnabled,
    getMockModeServerSnapshot,
  );

  const handleSelect = (nextEnabled: boolean) => {
    if (nextEnabled === isEnabled) {
      return;
    }
    setMockModeEnabled(nextEnabled);
    // 切替前の取得結果が残らないようキャッシュを破棄する
    queryClient.clear();
    notifySuccess(nextEnabled ? MOCK_ENABLED_MESSAGE : MOCK_DISABLED_MESSAGE);
  };

  return (
    <div
      role="radiogroup"
      aria-label={GROUP_LABEL}
      title="開発用の通信先切替 本番ビルドでは表示されない"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-zinc-900/95 py-1.5 pl-3 pr-1.5 shadow-lg ring-1 ring-zinc-700"
    >
      <span className="text-xs font-medium text-zinc-400">{GROUP_LABEL}</span>
      <div className="flex items-center gap-1">
        {API_MODE_OPTIONS.map((option) => {
          const isSelected = option.isMock === isEnabled;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option.isMock)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-amber-400 text-black"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Icon name={option.icon} size={14} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
