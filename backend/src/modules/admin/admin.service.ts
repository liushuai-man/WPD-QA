import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminProfile = async (username: string) => {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    throw new Error('管理员不存在');
  }

  return {
    success: true,
    admin: {
      id: String(admin.id),
      username: admin.username,
      role: admin.role,
    },
  };
};

export const loginAdmin = async (username: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    throw new Error('管理员不存在');
  }

  if (admin.passwordHash !== password) {
    throw new Error('密码错误');
  }

  return {
    success: true,
    admin: {
      id: String(admin.id),
      username: admin.username,
      role: admin.role,
    },
  };
};
