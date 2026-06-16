import request from '../utils/request';
import { ApiResponse, Conversation, Message } from '@/types';

export const chatService = {
  async sendMessage(content: string, conversationId?: string) {
    const response = await request.post<
      ApiResponse<{ conversationId: string; message: Message }>
    >('/chat/send', {
      content,
      conversationId,
    });
    return response;
  },

  async getConversations(page = 1, limit = 10) {
    return await request.get<
      ApiResponse<{
        items: Conversation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>
    >('/chat/conversations', {
      params: { page, limit },
    });
    
  },

  async getConversation(id: string) {
    return await request.get<
      ApiResponse<Conversation & { messages: Message[] }>
    >(`/chat/conversations/${id}`);
  },

  async deleteConversation(id: string) {
    return await request.delete<ApiResponse>(
      `/chat/conversations/${id}`
    );
  },
};
