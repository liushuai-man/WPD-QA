export interface Pagination<T> {
  list: T[];
  total: number;
}

export interface Question {
  id: number;
  title: string;
  options: { label: string; content: string }[];
  answer: string;
  analysis?: string;
  difficulty: number;
  categoryId?: number | null;
  categoryName?: string | null;
  createdAt: string;
}

export interface QuizRecord {
  id?: number;
  userId?: number;
  questionId: number;
  userAnswer?: string;
  isCorrect?: boolean;
  createdAt?: string;
}
