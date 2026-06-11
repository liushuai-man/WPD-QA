import request from '@/utils/request';
import type { ApiResponse } from '@/types/index';
import type { LoginResponse, RegisterResponse, ProfileResponse } from '@/types/auth';

export const authApi = {
  sendRegisterCode: async (email: string): Promise<ApiResponse> => {
    return request.post('/api/auth/send-register-code', { email });
  },

  register: async (
    email: string,
    code: string,
    nickname: string,
    password: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    return request.post('/api/auth/register', {
      email,
      code,
      nickname,
      password,
    });
  },

  sendLoginCode: async (email: string): Promise<ApiResponse> => {
    return request.post('/api/auth/send-login-code', { email });
  },

  login: async (email: string, code: string): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/api/auth/login', { email, code });
  },

  loginWithPassword: async (
    email: string,
    password: string,
    turnstileToken: string
  ): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/api/auth/login-password', {
      email,
      password,
      turnstileToken,
    });
  },

  sendResetCode: async (email: string): Promise<ApiResponse> => {
    return request.post('/api/auth/send-reset-code', { email });
  },

  resetPassword: async (
    email: string,
    code: string,
    password: string
  ): Promise<ApiResponse> => {
    return request.post('/api/auth/reset-password', {
      email,
      code,
      password,
    });
  },

  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    return request.get('/api/auth/profile');
  },
};