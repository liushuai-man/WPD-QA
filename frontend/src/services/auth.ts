import request from '@/utils/request';
import type { ApiResponse } from '@/types/index';
import type { LoginResponse, RegisterResponse, ProfileResponse } from '@/types/auth';

export const authApi = {
  sendRegisterCode: async (email: string): Promise<ApiResponse> => {
    return request.post('/auth/send-register-code', { email });
  },

  register: async (
    email: string,
    code: string,
    nickname: string,
    password: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    return request.post('/auth/register', {
      email,
      code,
      nickname,
      password,
    });
  },

  sendLoginCode: async (email: string): Promise<ApiResponse> => {
    return request.post('/auth/send-login-code', { email });
  },

  login: async (email: string, code: string): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/auth/login', { email, code });
  },

  loginWithPassword: async (
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/auth/login-password', {
      email,
      password,
    });
  },

  sendResetCode: async (email: string): Promise<ApiResponse> => {
    return request.post('/auth/send-reset-code', { email });
  },

  resetPassword: async (
    email: string,
    code: string,
    password: string
  ): Promise<ApiResponse> => {
    return request.post('/auth/reset-password', {
      email,
      code,
      password,
    });
  },

  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    return request.get('/auth/profile');
  },
};