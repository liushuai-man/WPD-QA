import { Request, Response } from 'express';
import type { ApiResponse } from '../../types';
import {
  getUserById,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
  getAllUsers,
} from './user.service';

export const handleGetUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getUserById(id);
    const response: ApiResponse<{
      user: {
        id: string;
        email: string;
        nickname: string;
        avatar: string | null;
        createdAt: string;
      };
    }> = {
      code: 200,
      message: '查询成功',
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

export const handleUpdateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        code: 401,
        message: '未授权',
      };
      return res.status(401).json(response);
    }
    const { nickname, avatar } = req.body;
    const result = await updateUserProfile(req.user.id, nickname, avatar);
    const response: ApiResponse<{
      user: {
        id: string;
        email: string;
        nickname: string;
        avatar: string | null;
      };
    }> = {
      code: 200,
      message: '更新成功',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          nickname: result.user.nickname,
          avatar: result.user.avatar,
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

export const handleUpdateUserPassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        code: 401,
        message: '未授权',
      };
      return res.status(401).json(response);
    }
    const { oldPassword, newPassword } = req.body;
    await updateUserPassword(req.user.id, oldPassword, newPassword);
    const response: ApiResponse = {
      code: 200,
      message: '密码更新成功',
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

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    const response: ApiResponse = {
      code: 200,
      message: '删除成功',
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

export const handleGetAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await getAllUsers();
    const response: ApiResponse<{
      users: Array<{
        id: string;
        email: string;
        nickname: string;
        avatar: string | null;
        createdAt: string;
      }>;
    }> = {
      code: 200,
      message: '查询成功',
      data: {
        users: result.users.map((user) => ({
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          createdAt: user.createdAt.toISOString(),
        })),
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
