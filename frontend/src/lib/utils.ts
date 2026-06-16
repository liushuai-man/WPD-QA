// 工具函数
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: '请输入邮箱' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '请输入有效的邮箱地址' };
  }
  return { isValid: true, message: '' };
}

export function validateCode(code: string): ValidationResult {
  if (!code) {
    return { isValid: false, message: '请输入验证码' };
  }
  if (code.length !== 6) {
    return { isValid: false, message: '验证码必须是6位数字' };
  }
  if (!/^\d{6}$/.test(code)) {
    return { isValid: false, message: '验证码只能包含数字' };
  }
  return { isValid: true, message: '' };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: '请输入密码' };
  }
  if (password.length < 6) {
    return { isValid: false, message: '密码长度至少6位' };
  }
  return { isValid: true, message: '' };
}

export function validateConfirmPassword(
  confirmPassword: string,
  password: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, message: '请再次输入密码' };
  }
  if (confirmPassword !== password) {
    return { isValid: false, message: '两次输入的密码不一致' };
  }
  return { isValid: true, message: '' };
}

export function validateNickname(nickname: string): ValidationResult {
  if (!nickname) {
    return { isValid: false, message: '请输入昵称' };
  }
  if (nickname.length < 2 || nickname.length > 20) {
    return { isValid: false, message: '昵称长度应在2-20个字符之间' };
  }
  return { isValid: true, message: '' };
}
