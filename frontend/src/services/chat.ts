import api from '../lib/api';
import { ApiResponse, PaginatedResponse, Conversation, Message } from '@/types';

export const chatService = {
  async sendMessage(content: string, conversationId?: number) {
    const response = await api.post<ApiResponse<{ conversationId: number; message: Message }>>('/chat/send', {
      content,
      conversationId,
    });
    return response.data;
  },

  async getConversations(page = 1, limit = 10) {
    const response = await api.get<ApiResponse<PaginatedResponse<Conversation>>>('/chat/conversations', {
      params: { page, limit },
    });
    return response.data;
  },

  async getConversation(id: number) {
    const response = await api.get<ApiResponse<Conversation & { messages: Message[] }>>(`/chat/conversations/${id}`);
    return response.data;
  },

  async deleteConversation(id: number) {
    const response = await api.delete<ApiResponse>(`/chat/conversations/${id}`);
    return response.data;
  },
};
