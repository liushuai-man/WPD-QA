import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface AdminPayload {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未授权，请先登录' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAdminToken(token);

    if (!decoded) {
      return res.status(401).json({ code: 401, message: 'token无效或已过期' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: BigInt(decoded.id) },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(401).json({ code: 401, message: '管理员不存在' });
    }

    req.admin = {
      id: String(admin.id),
      username: admin.username,
      role: admin.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: '认证失败' });
  }
};

// Simple token verification for admin (separate from user token)
const ADMIN_JWT_SECRET = process.env.JWT_SECRET || 'wpd-admin-secret-key';

export const verifyAdminToken = (token: string): AdminPayload | null => {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const generateAdminToken = (admin: AdminPayload): string => {
  return jwt.sign(admin, ADMIN_JWT_SECRET, { expiresIn: '7d' });
};

// Login handler
export const handleAdminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ code: 400, message: '用户名和密码不能为空' });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ code: 401, message: '管理员不存在' });
    }

    // 检查是否为明文密码（用于初始设置）
    const isPlainPassword = admin.passwordHash.length < 60; // bcrypt hash 长度约为 60
    let isPasswordValid = false;

    if (isPlainPassword) {
      // 明文密码比较（仅用于初始阶段）
      isPasswordValid = admin.passwordHash === password;
    } else {
      // 使用 bcrypt 验证
      isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ code: 401, message: '密码错误' });
    }

    const token = generateAdminToken({
      id: String(admin.id),
      username: admin.username,
      role: admin.role,
    });

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        accessToken: token,
        admin: {
          id: Number(admin.id),
          username: admin.username,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ code: 500, message: '登录失败' });
  }
};
