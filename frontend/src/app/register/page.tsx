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
  Grid,
} from '@mantine/core';
import { Mail, User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import {
  validateEmail,
  validateCode,
  validatePassword,
  validateConfirmPassword,
  validateNickname,
} from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeButtonText, setCodeButtonText] = useState('发送验证码');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleValidateEmail = (email: string) => {
    const result = validateEmail(email);
    setEmailError(result.message);
    return result.isValid;
  };

  const handleValidateCode = (code: string) => {
    const result = validateCode(code);
    setCodeError(result.message);
    return result.isValid;
  };

  const handleValidateNickname = (nickname: string) => {
    const result = validateNickname(nickname);
    setNicknameError(result.message);
    return result.isValid;
  };

  const handleValidatePassword = (password: string) => {
    const result = validatePassword(password);
    setPasswordError(result.message);
    return result.isValid;
  };

  const handleValidateConfirmPassword = (
    confirmPassword: string,
    password: string
  ) => {
    const result = validateConfirmPassword(confirmPassword, password);
    setConfirmPasswordError(result.message);
    return result.isValid;
  };

  const handleSendCode = async () => {
    if (!handleValidateEmail(email)) {
      return;
    }

    setIsSending(true);
    try {
      const result = await authApi.sendRegisterCode(email);
      if (result.code === 200) {
        setError('');
        let count = 60;
        setCodeButtonText(`${count}秒后重发`);
        const timer = setInterval(() => {
          count--;
          if (count <= 0) {
            clearInterval(timer);
            setCodeButtonText('发送验证码');
          } else {
            setCodeButtonText(`${count}秒后重发`);
          }
        }, 1000);
      } else {
        setError(result.message || '发送失败');
      }
    } catch (err: any) {
      setError(err.message || '发送失败');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = handleValidateEmail(email);
    const isCodeValid = handleValidateCode(code);
    const isNicknameValid = handleValidateNickname(nickname);
    const isPasswordValid = handleValidatePassword(password);
    const isConfirmValid = handleValidateConfirmPassword(
      confirmPassword,
      password
    );

    if (
      !isEmailValid ||
      !isCodeValid ||
      !isNicknameValid ||
      !isPasswordValid ||
      !isConfirmValid
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.register(email, code, nickname, password);
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
        router.push('/login');
      } else {
        setError(result.message || '注册失败');
      }
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" shadow="lg" radius="xl" p="lg">
        <Box className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <Title order={2} className="text-gray-800">
            注册
          </Title>
          <p className="text-gray-500 mt-2 text-sm">
            创建账号，开启智能问答之旅
          </p>
        </Box>

        {error && (
          <Alert color="red" variant="light" className="mb-4" title="提示">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                邮箱 <span className="text-red-500">*</span>
              </label>
              {emailError && (
                <span className="text-sm text-red-500">{emailError}</span>
              )}
            </div>
            <TextInput
              placeholder="请输入邮箱地址"
              leftSection={<Mail className="w-4 h-4 text-gray-400" />}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                setError('');
                if (emailError) handleValidateEmail(e.currentTarget.value);
              }}
              onBlur={() => handleValidateEmail(email)}
              type="email"
              radius="md"
            />
          </div>

          <Grid gap={4}>
            <Grid.Col span={8}>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    验证码 <span className="text-red-500">*</span>
                  </label>
                  {codeError && (
                    <span className="text-sm text-red-500">{codeError}</span>
                  )}
                </div>
                <div className=" flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <TextInput
                      placeholder="请输入验证码"
                      leftSection={<Lock className="w-4 h-4 text-gray-400" />}
                      value={code}
                      onChange={(e) => {
                        setCode(e.currentTarget.value);
                        setError('');
                        if (codeError)
                          handleValidateCode(e.currentTarget.value);
                      }}
                      onBlur={() => handleValidateCode(code)}
                      type="number"
                      radius="md"
                    />
                  </div>
                  <div className="">
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSending || codeButtonText.includes('秒')}
                      size="sm"
                      variant="outline"
                      fullWidth
                      radius="md"
                      px={4}
                    >
                      {codeButtonText}
                    </Button>
                  </div>
                </div>
              </div>
            </Grid.Col>
          </Grid>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                昵称 <span className="text-red-500">*</span>
              </label>
              {nicknameError && (
                <span className="text-sm text-red-500">{nicknameError}</span>
              )}
            </div>
            <TextInput
              placeholder="请输入昵称（2-20个字符）"
              leftSection={<User className="w-4 h-4 text-gray-400" />}
              value={nickname}
              onChange={(e) => {
                setNickname(e.currentTarget.value);
                setError('');
                if (nicknameError)
                  handleValidateNickname(e.currentTarget.value);
              }}
              onBlur={() => handleValidateNickname(nickname)}
              radius="md"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                密码 <span className="text-red-500">*</span>
              </label>
              {passwordError && (
                <span className="text-sm text-red-500">{passwordError}</span>
              )}
            </div>
            <PasswordInput
              placeholder="请输入密码（至少6位）"
              leftSection={<Lock className="w-4 h-4 text-gray-400" />}
              value={password}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
                setError('');
                if (passwordError)
                  handleValidatePassword(e.currentTarget.value);
              }}
              onBlur={() => handleValidatePassword(password)}
              radius="md"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                确认密码 <span className="text-red-500">*</span>
              </label>
              {confirmPasswordError && (
                <span className="text-sm text-red-500">
                  {confirmPasswordError}
                </span>
              )}
            </div>
            <PasswordInput
              placeholder="请再次输入密码"
              leftSection={<Lock className="w-4 h-4 text-gray-400" />}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.currentTarget.value);
                setError('');
                if (confirmPasswordError)
                  handleValidateConfirmPassword(
                    e.currentTarget.value,
                    password
                  );
              }}
              onBlur={() =>
                handleValidateConfirmPassword(confirmPassword, password)
              }
              radius="md"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12"
            size="lg"
            radius="md"
            rightSection={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? '注册中...' : '注册'}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Anchor href="/login" size="sm" className="text-blue-600">
            已有账号？立即登录
          </Anchor>
        </Box>
      </Card>
    </Box>
  );
}
