import request from '../utils/request';
import { ApiResponse, Conversation, Message } from '@/types';

export const chatService = {
  async sendMessage(content: string, conversationId?: string) {
    const response = await request.post<ApiResponse<{ conversationId: string; message: Message }>>('/api/chat/send', {
      content,
      conversationId,
    });
    return response;
  },

  async getConversations(page = 1, limit = 10) {
    const response = await request.get<ApiResponse<{ items: Conversation[]; total: number; page: number; limit: number; totalPages: number }>>('/api/chat/conversations', {
      params: { page, limit },
    });
    return response;
  },

  async getConversation(id: string) {
    const response = await request.get<ApiResponse<Conversation & { messages: Message[] }>>(`/api/chat/conversations/${id}`);
    return response;
  },

  async deleteConversation(id: string) {
    const response = await request.delete<ApiResponse>(`/api/chat/conversations/${id}`);
    return response;
  },
};