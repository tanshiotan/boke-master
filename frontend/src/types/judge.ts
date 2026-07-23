export type JudgeScore = {
  judge: string;
  score: number;
  comment: string;
};

export type JudgeResponse = {
  id: string;
  total_score: number;
  judges: JudgeScore[];
};

export type JudgeResult = {
  id: string;
  odai: string;
  answer: string;
  total_score: number;
  judges: JudgeScore[];
};
