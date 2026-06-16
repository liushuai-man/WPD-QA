import request from '@/utils/request';
import type { ApiResponse } from '@/types/index';
import type { User } from '@/types/auth';

export const userApi = {
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    return request.get('/auth/profile');
  },

  updateProfile: async (
    nickname?: string,
    avatar?: string
  ): Promise<ApiResponse<{ user: User }>> => {
    return request.put('/users/profile', { nickname, avatar });
  },

  updatePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    return request.put('/users/password', { oldPassword, newPassword });
  },
};