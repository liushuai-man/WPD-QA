export interface User {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  user: User;
  createdAt: string;
}


export interface Conversation {
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

