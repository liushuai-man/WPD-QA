import request from '@/utils/request';
import type { ApiResponse, Pagination, Question } from '@/types';

interface WrongQuestion extends Question {
  options: { label: string; content: string }[];
  userAnswer: string;
  reviewed: boolean;
  createdAt: string;
}

export const quizApi = {
  getQuestions: async (page: number, limit: number): Promise<ApiResponse<Pagination<Question>>> => {
    return await request.get(`/quiz/questions?page=${page}&limit=${limit}`);
  },

  submitAnswer: async (questionId: number, answer: string): Promise<ApiResponse<{ isCorrect: boolean }>> => {
    return await request.post('/quiz/answer', { questionId, answer });
  },

  getWrongQuestions: async (page: number, limit: number): Promise<ApiResponse<Pagination<WrongQuestion>>> => {
    return await request.get(`/quiz/wrong?page=${page}&limit=${limit}`);
  },

  getStatistics: async (): Promise<ApiResponse<{
    totalQuestions: number;
    correctCount: number;
    wrongCount: number;
    accuracy: number;
  }>> => {
    return await request.get('/quiz/statistics');
  },

  removeFromWrongBook: async (questionId: number): Promise<ApiResponse<void>> => {
    return await request.delete(`/quiz/wrong/${questionId}`);
  },
};
