import { Request, Response } from 'express';
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
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleUpdateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const { nickname, avatar } = req.body;
    const result = await updateUserProfile(req.user.id, nickname, avatar);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleUpdateUserPassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const { oldPassword, newPassword } = req.body;
    const result = await updateUserPassword(
      req.user.id,
      oldPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await getAllUsers();
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
