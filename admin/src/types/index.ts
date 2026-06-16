export interface Admin {
  id: number;
  username: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string | null;
  avatar: string | null;
  chatCount: number;
  quizCount: number;
  createdAt: string;
}

export interface Knowledge {
  id: number;
  title: string;
  source: string;
  categoryName: string;
  content: string;
  createdAt: string;
}

export interface Question {
  id: number;
  title: string;
  options: Array<{ label: string; content: string }>;
  answer: string;
  analysis: string | null;
  difficulty: number;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
}

export interface Conversation {
  id: number;
  title: string;
  userId: number;
  userEmail: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalUsers: number;
  todayActiveUsers: number;
  totalChats: number;
  todayChats: number;
  totalQuiz: number;
  todayQuiz: number;
  knowledgeCount: number;
  questionCount: number;
  ragHitRate: number;
}

export interface Pagination<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
