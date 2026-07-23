const MOCK_MODE_STORAGE_KEY = "boke-master:use-mock-api";

const MOCK_MODE_CHANGE_EVENT = "boke-master:mock-mode-change";

const MOCK_MODE_ENABLED_VALUE = "true";

// 開発ビルドのみ有効 本番ビルドではfalse固定になりモック実装ごと取り除かれる
export const IS_MOCK_MODE_AVAILABLE = process.env.NODE_ENV === "development";

export function isMockModeEnabled(): boolean {
  if (!IS_MOCK_MODE_AVAILABLE || typeof window === "undefined") {
    return false;
  }
  return (
    window.localStorage.getItem(MOCK_MODE_STORAGE_KEY) ===
    MOCK_MODE_ENABLED_VALUE
  );
}

export function setMockModeEnabled(enabled: boolean): void {
  if (!IS_MOCK_MODE_AVAILABLE || typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(enabled));
  window.dispatchEvent(new Event(MOCK_MODE_CHANGE_EVENT));
}

export function subscribeMockMode(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(MOCK_MODE_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(MOCK_MODE_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// サーバーレンダリング時は常に実API扱いにしてハイドレーション差分を防ぐ
export function getMockModeServerSnapshot(): boolean {
  return false;
}
