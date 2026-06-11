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
  CheckIcon,
  Grid,
} from '@mantine/core';
import { Mail, Lock, ArrowRight, Send } from 'lucide-react';
import { authApi } from '@/api/auth';
import {
  validateEmail,
  validateCode,
  validatePassword,
  validateConfirmPassword,
} from '@/lib/utils';

type Step = 'email' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeButtonText, setCodeButtonText] = useState('发送验证码');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
      const result = await authApi.sendResetCode(email);
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
        setStep('code');
      } else {
        setError(result.message || '发送失败');
      }
    } catch (err: any) {
      setError(err.message || '发送失败');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!handleValidateCode(code)) {
      return;
    }
    setStep('password');
  };

  const handleResetPassword = async () => {
    const isPasswordValid = handleValidatePassword(password);
    const isConfirmValid = handleValidateConfirmPassword(
      confirmPassword,
      password
    );

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.resetPassword(email, code, password);
      if (result.code === 200) {
        setStep('success');
      } else {
        setError(result.message || '重置失败');
      }
    } catch (err: any) {
      setError(err.message || '重置失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" shadow="lg" radius="xl" p="lg">
        {step === 'email' && (
          <>
            <Box className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <Title order={2} className="text-gray-800">
                忘记密码
              </Title>
              <p className="text-gray-500 mt-2 text-sm">
                输入您的邮箱，我们将发送验证码
              </p>
            </Box>

            {error && (
              <Alert color="red" variant="light" className="mb-4" title="提示">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
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

              <Button
                onClick={handleSendCode}
                disabled={isSending}
                className="w-full h-12"
                size="lg"
                radius="md"
                rightSection={<ArrowRight className="w-4 h-4" />}
              >
                {isSending ? '发送中...' : '发送验证码'}
              </Button>
            </div>

            <Box className="mt-6 text-center">
              <Anchor href="/login" size="sm" className="text-gray-500">
                返回登录
              </Anchor>
            </Box>
          </>
        )}

        {step === 'code' && (
          <>
            <Box className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <Title order={2} className="text-gray-800">
                验证身份
              </Title>
              <p className="text-gray-500 mt-2 text-sm">输入邮箱收到的验证码</p>
            </Box>

            {error && (
              <Alert color="red" variant="light" className="mb-4" title="提示">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
              <Grid gap={4}>
                <Grid.Col span={8}>
                  <TextInput
                    label="验证码"
                    placeholder="请输入验证码"
                    leftSection={<Lock className="w-4 h-4 text-gray-400" />}
                    value={code}
                    onChange={(e) => {
                      setCode(e.currentTarget.value);
                      setError('');
                    }}
                    onBlur={() => handleValidateCode(code)}
                    type="number"
                    radius="md"
                    error={codeError}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <div className="pt-8">
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSending || codeButtonText.includes('秒')}
                      size="sm"
                      variant="outline"
                      fullWidth
                      leftSection={<Send className="w-4 h-4" />}
                      radius="md"
                    >
                      {codeButtonText}
                    </Button>
                  </div>
                </Grid.Col>
              </Grid>

              <Button
                onClick={handleVerifyCode}
                className="w-full h-12"
                size="lg"
                radius="md"
                rightSection={<ArrowRight className="w-4 h-4" />}
              >
                下一步
              </Button>
            </div>

            <Box className="mt-6 text-center flex justify-center gap-4">
              <Anchor
                href="#"
                onClick={() => setStep('email')}
                size="sm"
                className="text-gray-500"
              >
                返回
              </Anchor>
              <Anchor href="/login" size="sm" className="text-gray-500">
                返回登录
              </Anchor>
            </Box>
          </>
        )}

        {step === 'password' && (
          <>
            <Box className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <Title order={2} className="text-gray-800">
                重置密码
              </Title>
              <p className="text-gray-500 mt-2 text-sm">设置新的登录密码</p>
            </Box>

            {error && (
              <Alert color="red" variant="light" className="mb-4" title="提示">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
              <PasswordInput
                label="新密码"
                placeholder="请输入新密码（至少6位）"
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

              <PasswordInput
                label="确认密码"
                placeholder="请再次输入密码"
                leftSection={<Lock className="w-4 h-4 text-gray-400" />}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.currentTarget.value);
                  setError('');
                }}
                onBlur={() =>
                  handleValidateConfirmPassword(confirmPassword, password)
                }
                radius="md"
                error={confirmPasswordError}
                withAsterisk
              />

              <Button
                onClick={handleResetPassword}
                disabled={isSubmitting}
                className="w-full h-12"
                size="lg"
                radius="md"
                rightSection={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? '重置中...' : '重置密码'}
              </Button>
            </div>

            <Box className="mt-6 text-center">
              <Anchor href="/login" size="sm" className="text-gray-500">
                返回登录
              </Anchor>
            </Box>
          </>
        )}

        {step === 'success' && (
          <>
            <Box className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-10 h-10 text-green-600" />
              </div>
              <Title order={2} className="text-gray-800 mb-2">
                重置成功
              </Title>
              <p className="text-gray-500 mb-8">
                您的密码已成功重置，请使用新密码登录
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full h-12"
                size="lg"
                radius="md"
                rightSection={<ArrowRight className="w-4 h-4" />}
              >
                返回登录
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
}
