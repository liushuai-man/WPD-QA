import { Request, Response } from 'express';
import {
  getOverallStats,
  getUserStats,
  getDailyStats,
} from './statistics.service';

export const handleGetOverallStats = async (_req: Request, res: Response) => {
  try {
    const result = await getOverallStats();
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetUserStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const result = await getUserStats(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetDailyStats = async (_req: Request, res: Response) => {
  try {
    const result = await getDailyStats();
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
