import { Request, Response } from 'express';
import type { ApiResponse } from '../../types';
import {
  sendRegisterCode,
  register,
  sendLoginCode,
  loginWithCode,
  loginWithPassword,
  sendResetCode,
  resetPassword,
  getProfile,
} from './auth.service';

export const handleSendRegisterCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await sendRegisterCode(email);
    const response: ApiResponse = {
      code: 200,
      message: '验证码已发送',
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { email, code, nickname, password } = req.body;
    const result = await register(email, code, nickname, password);
    const response: ApiResponse<{
      user: { id: string; email: string; nickname: string; avatar: string | null };
      accessToken: string;
      refreshToken: string;
    }> = {
      code: 200,
      message: '注册成功',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          nickname: result.user.nickname,
          avatar: result.user.avatar,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleSendLoginCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await sendLoginCode(email);
    const response: ApiResponse = {
      code: 200,
      message: '验证码已发送',
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleLoginWithCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const result = await loginWithCode(email, code);
    const response: ApiResponse<{
      user: { id: string; email: string; nickname: string; avatar: string | null };
      accessToken: string;
      refreshToken: string;
    }> = {
      code: 200,
      message: '登录成功',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          nickname: result.user.nickname,
          avatar: result.user.avatar,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleLoginWithPassword = async (req: Request, res: Response) => {
  try {
    const { email, password, turnstileToken } = req.body;
    const result = await loginWithPassword(email, password, turnstileToken);
    const response: ApiResponse<{
      user: { id: string; email: string; nickname: string; avatar: string | null };
      accessToken: string;
      refreshToken: string;
    }> = {
      code: 200,
      message: '登录成功',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          nickname: result.user.nickname,
          avatar: result.user.avatar,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleSendResetCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await sendResetCode(email);
    const response: ApiResponse = {
      code: 200,
      message: '验证码已发送',
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleResetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, password } = req.body;
    await resetPassword(email, code, password);
    const response: ApiResponse = {
      code: 200,
      message: '密码重置成功',
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};

export const handleGetProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        code: 401,
        message: '未授权',
      };
      return res.status(401).json(response);
    }

    const result = await getProfile(req.user.email);
    const response: ApiResponse<{
      user: { id: string; email: string; nickname: string; avatar: string | null; createdAt: string };
    }> = {
      code: 200,
      message: '获取成功',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          nickname: result.user.nickname,
          avatar: result.user.avatar,
          createdAt: result.user.createdAt.toISOString(),
        },
      },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: 400,
      message: (error as Error).message,
    };
    res.status(400).json(response);
  }
};