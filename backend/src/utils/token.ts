import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (payload: { email: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: { email: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
  } catch {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
