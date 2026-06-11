'use client';

import { useState, useEffect, useRef } from 'react';
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
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import { validateEmail, validatePassword } from '@/lib/utils';

interface TurnstileInstance {
  reset(): void;
  remove(): void;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileInstanceRef = useRef<TurnstileInstance | null>(null);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (
        turnstileRef.current &&
        typeof (window as any).Turnstile !== 'undefined'
      ) {
        turnstileInstanceRef.current = (window as any).Turnstile.render(
          turnstileRef.current,
          {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
            callback: (token: string) => {
              setTurnstileToken(token);
              setError('');
            },
            'error-callback': () => {
              setError('人机验证失败，请重试');
            },
          }
        );
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      if (turnstileInstanceRef.current) {
        turnstileInstanceRef.current.remove();
      }
    };
  }, []);

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

    if (process.env.NEXT_PUBLIC_NODE_ENV !== 'development' && !turnstileToken) {
      setError('请完成人机验证');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.loginWithPassword(
        email,
        password,
        turnstileToken
      );
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
      setTurnstileToken('');
      if (turnstileInstanceRef.current) {
        turnstileInstanceRef.current.reset();
      }
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

          <Box className="pt-2" ref={turnstileRef} />

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
