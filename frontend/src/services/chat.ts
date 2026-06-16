import request from '../utils/request';
import { ApiResponse, Conversation, Message } from '@/types';

export const chatApi = {
  async sendMessage(
    content: string,
    conversationId?: string
  ): Promise<ApiResponse<{ conversationId: string; message: Message }>> {
    const response = await request.post('/chat', {
      content,
      conversationId,
    });
    return response;
  },

  async getConversations(
    page = 1,
    limit = 10
  ): Promise<
    ApiResponse<{
      items: Conversation[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    return await request.get('/chat/conversations', {
      params: { page, limit },
    });
  },

  async getConversation(
    id: string
  ): Promise<ApiResponse<Conversation & { messages: Message[] }>> {
    return await request.get(`/chat/conversations/${id}`);
  },

  async deleteConversation(id: string): Promise<ApiResponse> {
    return await request.delete(`/chat/conversations/${id}`);
  },
};
