export interface User {
  id: number;
  email: string;
  nickname?: string;
  avatar?: string;
  chatCount: number;
  quizCount: number;
  createdAt: string;
}

export interface Admin {
  id: number;
  username: string;
  role: string;
}

export interface Question {
  id: number;
  title: string;
  options: Array<{ label: string; content: string }>;
  answer: string;
  analysis?: string;
  difficulty: number;
  categoryId?: number;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: number;
  title: string;
  source?: string;
  categoryId?: number;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
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

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}
