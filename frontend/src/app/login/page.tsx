'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  TextInput,
  PasswordInput,
  Alert,
  Anchor,
  Box,
  Title,
} from '@mantine/core';
import { Mail, Lock, ArrowRight, Home } from 'lucide-react';
import { authApi } from '@/services/auth';
import { useAuthStore } from '@/store/useUserStore';
import { validateEmail, validatePassword } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleValidateEmail = (email: string) => {
    const result = validateEmail(email);
    setEmailError(result.message);
    return result.isValid;
  };

  const handleValidatePassword = (password: string) => {
    const result = validatePassword(password);
    setPasswordError(result.message);
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = handleValidateEmail(email);
    const isPasswordValid = handleValidatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.loginWithPassword(email, password);
      if (result.code === 200 && result.data) {
        login(
          {
            id: result.data.user.id,
            email: result.data.user.email,
            nickname: result.data.user.nickname || null,
            avatar: result.data.user.avatar || null,
          },
          result.data.accessToken,
          result.data.refreshToken
        );
        router.push('/');
      } else {
        setError(result.message || '登录失败');
      }
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" shadow="lg" radius="xl" p="lg">
        <Box className="flex justify-between items-start mb-6">
          <Box className="flex-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <Title order={2} className="text-gray-800">
              登录
            </Title>
            <p className="text-gray-500 mt-2 text-sm">
              欢迎回来，使用邮箱密码登录
            </p>
          </Box>
          <Button
            type="button"
            onClick={() => router.push('/')}
            variant="outline"
            size="sm"
            className="h-8"
            leftSection={<Home className="w-4 h-4" />}
          >
            返回首页
          </Button>
        </Box>

        {error && (
          <Alert color="red" variant="light" className="mb-4" title="提示">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="邮箱"
            placeholder="请输入邮箱地址"
            leftSection={<Mail className="w-4 h-4 text-gray-400" />}
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
              setError('');
            }}
            onBlur={() => handleValidateEmail(email)}
            type="email"
            radius="md"
            error={emailError}
            withAsterisk
          />

          <PasswordInput
            label="密码"
            placeholder="请输入密码（至少6位）"
            leftSection={<Lock className="w-4 h-4 text-gray-400" />}
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
              setError('');
            }}
            onBlur={() => handleValidatePassword(password)}
            radius="md"
            error={passwordError}
            withAsterisk
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12"
            size="lg"
            radius="md"
            rightSection={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? '登录中...' : '登录'}
          </Button>
        </form>

        <Box className="mt-6 flex justify-center gap-6">
          <Anchor href="/forgot-password" size="sm" className="text-gray-500">
            忘记密码？
          </Anchor>
          <Anchor href="/register" size="sm" className="text-blue-600">
            还没有账号？立即注册
          </Anchor>
        </Box>
      </Card>
    </Box>
  );
}
