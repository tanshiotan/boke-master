import type { JudgeResponse, JudgeResult, JudgeScore } from "@/types/judge";

const MOCK_LATENCY_MS = 700;

const MOCK_RESULT_STORAGE_KEY = "boke-master:mock-results";

const MOCK_ID_PREFIX = "mock-";

const MOCK_SCORE_MIN = 5;

const MOCK_SCORE_MAX = 10;

const MOCK_RESULT_NOT_FOUND_MESSAGE = "モックの採点結果が見つかりません";

type MockJudgeProfile = {
  judge: string;
  comment: string;
};

// バックエンドのJUDGESと同じ並び
const MOCK_JUDGE_PROFILES: readonly MockJudgeProfile[] = [
  { judge: "松本人志風の毒舌審査員", comment: "発想は嫌いやないな" },
  {
    judge: "上沼恵美子風の辛口だが的確な審査員",
    comment: "落としどころが甘い",
  },
  {
    judge: "若手芸人目線のフレッシュな審査員",
    comment: "語感が気持ちええです",
  },
  {
    judge: "放送作家目線の構成・言葉選びに厳しい審査員",
    comment: "構成は整っている",
  },
  { judge: "一般視聴者目線の素直な審査員", comment: "普通に声出して笑った" },
] as const;

type MockResultStore = Record<string, JudgeResult>;

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const pickScore = () =>
  MOCK_SCORE_MIN +
  Math.floor(Math.random() * (MOCK_SCORE_MAX - MOCK_SCORE_MIN + 1));

const readStore = (): MockResultStore => {
  const raw = window.sessionStorage.getItem(MOCK_RESULT_STORAGE_KEY);
  if (raw === null) {
    return {};
  }
  try {
    return JSON.parse(raw) as MockResultStore;
  } catch {
    return {};
  }
};

const saveResult = (result: JudgeResult): void => {
  const store: MockResultStore = { ...readStore(), [result.id]: result };
  window.sessionStorage.setItem(MOCK_RESULT_STORAGE_KEY, JSON.stringify(store));
};

export async function mockPostJudge(
  odai: string,
  answer: string,
): Promise<JudgeResponse> {
  await delay(MOCK_LATENCY_MS);

  const judges: JudgeScore[] = MOCK_JUDGE_PROFILES.map((profile) => ({
    judge: profile.judge,
    score: pickScore(),
    comment: profile.comment,
  }));
  const totalScore = judges.reduce((sum, judge) => sum + judge.score, 0);
  const result: JudgeResult = {
    id: `${MOCK_ID_PREFIX}${crypto.randomUUID()}`,
    odai,
    answer,
    total_score: totalScore,
    judges,
  };

  saveResult(result);

  return { id: result.id, total_score: result.total_score, judges };
}

export async function mockFetchJudgeResult(id: string): Promise<JudgeResult> {
  await delay(MOCK_LATENCY_MS);

  const result = readStore()[id];
  if (result === undefined) {
    throw new Error(MOCK_RESULT_NOT_FOUND_MESSAGE);
  }
  return result;
}
