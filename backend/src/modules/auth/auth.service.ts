import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import {
  generateToken,
  generateRefreshToken,
  hashPassword,
  verifyPassword,
  generateVerificationCode,
} from '../../utils/token';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../../utils/email';
import {
  setVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
  setRefreshToken,
} from '../../utils/redis';
import {
  validateEmail,
  validatePassword,
  validateCode,
  validateNickname,
} from '../../utils/validation';

const prisma = new PrismaClient();

const verifyTurnstile = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }
    );
    return response.data.success;
  } catch {
    return false;
  }
};

export const sendRegisterCode = async (email: string) => {
  const validation = await validateEmail(email);
  if (validation.error) {
    throw new Error(validation.error);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('该邮箱已被注册');
  }

  const code = generateVerificationCode();
  await setVerificationCode(email, code);
  await sendVerificationEmail(email, code);

  return { success: true, message: '验证码已发送' };
};

export const register = async (
  email: string,
  code: string,
  nickname: string,
  password: string
) => {
  const emailValidation = await validateEmail(email);
  if (emailValidation.error) {
    throw new Error(emailValidation.error);
  }

  const codeValidation = await validateCode(code);
  if (codeValidation.error) {
    throw new Error(codeValidation.error);
  }

  const nicknameValidation = await validateNickname(nickname);
  if (nicknameValidation.error) {
    throw new Error(nicknameValidation.error);
  }

  const passwordValidation = await validatePassword(password);
  if (passwordValidation.error) {
    throw new Error(passwordValidation.error);
  }

  const storedCode = await getVerificationCode(email);
  if (!storedCode || storedCode !== code) {
    throw new Error('验证码无效');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('该邮箱已被注册');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nickname,
    },
  });

  await deleteVerificationCode(email);

  const accessToken = generateToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await setRefreshToken(email, refreshToken);

  return {
    success: true,
    user: {
      id: String(user.id),
      email: user.email,
      nickname: user.nickname || '',
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

export const sendLoginCode = async (email: string) => {
  const validation = await validateEmail(email);
  if (validation.error) {
    throw new Error(validation.error);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('该邮箱未注册');
  }

  const code = generateVerificationCode();
  await setVerificationCode(email, code);
  await sendVerificationEmail(email, code);

  return { success: true, message: '验证码已发送' };
};

export const loginWithCode = async (email: string, code: string) => {
  const emailValidation = await validateEmail(email);
  if (emailValidation.error) {
    throw new Error(emailValidation.error);
  }

  const codeValidation = await validateCode(code);
  if (codeValidation.error) {
    throw new Error(codeValidation.error);
  }

  const storedCode = await getVerificationCode(email);
  if (!storedCode || storedCode !== code) {
    throw new Error('验证码无效');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('该邮箱未注册');
  }

  await deleteVerificationCode(email);

  const accessToken = generateToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await setRefreshToken(email, refreshToken);

  return {
    success: true,
    user: {
      id: String(user.id),
      email: user.email,
      nickname: user.nickname || '',
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

export const loginWithPassword = async (
  email: string,
  password: string,
  turnstileToken: string
) => {
  const emailValidation = await validateEmail(email);
  if (emailValidation.error) {
    throw new Error(emailValidation.error);
  }

  const passwordValidation = await validatePassword(password);
  if (passwordValidation.error) {
    throw new Error(passwordValidation.error);
  }

  if (process.env.NODE_ENV !== 'development') {
    const isVerified = await verifyTurnstile(turnstileToken);
    if (!isVerified) {
      throw new Error('人机验证失败');
    }
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('该邮箱未注册');
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('密码错误');
  }

  const accessToken = generateToken({ email });
  const refreshToken = generateRefreshToken({ email });
  await setRefreshToken(email, refreshToken);

  return {
    success: true,
    user: {
      id: String(user.id),
      email: user.email,
      nickname: user.nickname || '',
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

export const sendResetCode = async (email: string) => {
  const validation = await validateEmail(email);
  if (validation.error) {
    throw new Error(validation.error);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('该邮箱未注册');
  }

  const code = generateVerificationCode();
  await setVerificationCode(email, code);
  await sendPasswordResetEmail(email, code);

  return { success: true, message: '验证码已发送' };
};

export const resetPassword = async (
  email: string,
  code: string,
  password: string
) => {
  const emailValidation = await validateEmail(email);
  if (emailValidation.error) {
    throw new Error(emailValidation.error);
  }

  const codeValidation = await validateCode(code);
  if (codeValidation.error) {
    throw new Error(codeValidation.error);
  }

  const passwordValidation = await validatePassword(password);
  if (passwordValidation.error) {
    throw new Error(passwordValidation.error);
  }

  const storedCode = await getVerificationCode(email);
  if (!storedCode || storedCode !== code) {
    throw new Error('验证码无效');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('该邮箱未注册');
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  await deleteVerificationCode(email);

  return { success: true, message: '密码重置成功' };
};

export const getProfile = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
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
