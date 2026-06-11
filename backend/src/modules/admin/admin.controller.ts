import { Request, Response } from 'express';
import { getAdminProfile, loginAdmin } from './admin.service';

export const handleGetAdminProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: '缺少用户名参数' });
    }
    const result = await getAdminProfile(username);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleLoginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginAdmin(username, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
