import axios from 'axios';
import type {
  User,
  Knowledge,
  Question,
  Conversation,
  Statistics,
  Pagination,
  ApiResponse,
} from '@/types';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<
      ApiResponse<{
        accessToken: string;
        admin: { id: number; username: string; role: string };
      }>
    >('/admin/login', { username, password });
    return response.data;
  },
};

export const userApi = {
  getUsers: async (page: number = 1, limit: number = 10, keyword?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (keyword) params.append('keyword', keyword);

    const response = await api.get<ApiResponse<Pagination<User>>>(
      `/admin/users?${params.toString()}`
    );
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/users/${id}`);
    return response.data;
  },
};

export const knowledgeApi = {
  getKnowledgeList: async (
    page: number = 1,
    limit: number = 10,
    keyword?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (keyword) params.append('keyword', keyword);

    const response = await api.get<ApiResponse<Pagination<Knowledge>>>(
      `/admin/knowledge?${params.toString()}`
    );
    return response.data;
  },

  uploadKnowledge: async (data: FormData) => {
    const response = await api.post<ApiResponse<Knowledge>>(
      '/admin/knowledge/upload',
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  deleteKnowledge: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(
      `/admin/knowledge/${id}`
    );
    return response.data;
  },
};

export const questionApi = {
  getQuestions: async (
    page: number = 1,
    limit: number = 10,
    keyword?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (keyword) params.append('keyword', keyword);

    const response = await api.get<ApiResponse<Pagination<Question>>>(
      `/admin/questions?${params.toString()}`
    );
    return response.data;
  },

  createQuestion: async (data: {
    title: string;
    options: Array<{ label: string; content: string }>;
    answer: string;
    analysis?: string;
    difficulty?: number;
    categoryId?: number | null;
  }) => {
    const response = await api.post<ApiResponse<Question>>(
      '/admin/questions',
      data
    );
    return response.data;
  },

  updateQuestion: async (
    id: number,
    data: Partial<{
      title: string;
      options: Array<{ label: string; content: string }>;
      answer: string;
      analysis?: string;
      difficulty?: number;
      categoryId?: number | null;
    }>
  ) => {
    const response = await api.put<ApiResponse<Question>>(
      `/admin/questions/${id}`,
      data
    );
    return response.data;
  },

  deleteQuestion: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(
      `/admin/questions/${id}`
    );
    return response.data;
  },
};

export const conversationApi = {
  getConversations: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<ApiResponse<Pagination<Conversation>>>(
      `/admin/conversations?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  deleteConversation: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(
      `/admin/conversations/${id}`
    );
    return response.data;
  },
};

export const statisticsApi = {
  getStatistics: async () => {
    const response =
      await api.get<ApiResponse<Statistics>>('/admin/statistics');
    return response.data;
  },
};

export const profileApi = {
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put<ApiResponse<null>>('/admin/profile/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default api;
