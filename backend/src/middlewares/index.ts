import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        nickname: string;
        avatar: string | null;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权，请先登录' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'token无效或已过期' });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    req.user = {
      id: String(user.id),
      email: user.email,
      nickname: user.nickname || '',
      avatar: user.avatar,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: '认证失败' });
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
      },
    });

    if (user) {
      req.user = {
        id: String(user.id),
        email: user.email,
        nickname: user.nickname || '',
        avatar: user.avatar,
      };
    }

    next();
  } catch {
    next();
  }
};
