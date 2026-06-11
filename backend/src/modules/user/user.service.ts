import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../utils/token';

const prisma = new PrismaClient();

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(id) },
    select: {
      id: true,
      email: true,
      nickname: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  return {
    success: true,
    user: {
      id: String(user.id),
      email: user.email,
      nickname: user.nickname || '',
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  };
};

export const updateUserProfile = async (
  id: string,
  nickname?: string,
  avatar?: string
) => {
  const data: { nickname?: string; avatar?: string } = {};
  if (nickname) data.nickname = nickname;
  if (avatar) data.avatar = avatar;

  const user = await prisma.user.update({
    where: { id: BigInt(id) },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      avatar: true,
    },
  });

  return {
    success: true,
    user: {
      id: String(user.id),
      email: user.email,
      nickname: user.nickname || '',
      avatar: user.avatar,
    },
  };
};

export const updateUserPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: BigInt(id) } });
  if (!user) {
    throw new Error('用户不存在');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: BigInt(id) },
    data: { passwordHash },
  });

  return { success: true, message: '密码更新成功' };
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id: BigInt(id) } });
  return { success: true, message: '删除成功' };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      nickname: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  const formattedUsers = users.map((u) => ({
    id: String(u.id),
    email: u.email,
    nickname: u.nickname || '',
    avatar: u.avatar,
    createdAt: u.createdAt,
  }));
  return { success: true, users: formattedUsers };
};
