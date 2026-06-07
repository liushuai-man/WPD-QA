import api from '@/lib/api';
import { ApiResponse, Statistics } from '@/types';

export const adminService = {
  async login(username: string, password: string) {
    const response = await api.post<ApiResponse<{ accessToken: string; admin: any }>>('/admin/login', {
      username,
      password,
    });
    return response.data;
  },

  async getStatistics() {
    const response = await api.get<ApiResponse<Statistics>>('/admin/statistics');
    return response.data;
  },
};
