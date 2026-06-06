export interface User {
  id: bigint;
  email: string;
  nickname?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  nickname?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface Admin {
  id: bigint;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface ChatMessage {
  id: bigint;
  conversationId: bigint;
  role: 'user' | 'assistant';
  content: string;
  promptTokens: number;
  completionTokens: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface Conversation {
  id: bigint;
  userId: bigint;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  messages: ChatMessage[];
}

export interface PestCategory {
  id: bigint;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: bigint;
  title: string;
  options: Record<string, string>;
  answer: string;
  analysis?: string;
  difficulty: number;
  categoryId?: bigint;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface QuizRecord {
  id: bigint;
  userId: bigint;
  questionId: bigint;
  userAnswer: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface KnowledgeDocument {
  id: bigint;
  title: string;
  source?: string;
  categoryId?: bigint;
  fileName?: string;
  fileType?: string;
  fileSize?: bigint;
  uploadUserId?: bigint;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface KnowledgeChunk {
  id: bigint;
  documentId: bigint;
  chunkIndex: number;
  title?: string;
  content: string;
  embedding?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface UserStatistics {
  id: bigint;
  userId: bigint;
  chatCount: number;
  quizCount: number;
  correctCount: number;
  updatedAt: Date;
}
