'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  TextInput,
  PasswordInput,
  Avatar,
  Alert,
  Box,
  Title,
  Badge,
  Divider,
} from '@mantine/core';
import {
  User,
  Mail,
  Camera,
  Edit2,
  Save,
  ArrowLeft,
  Shield,
  CheckIcon,
} from 'lucide-react';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store';
import { validateNickname, validatePassword } from '@/lib/utils';

type TabType = 'profile' | 'password';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user, setUser] = useState({
    id: '',
    email: '',
    nickname: '',
    avatar: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const result = await userApi.getProfile();
      if (result.code === 200 && result.data) {
        setUser(result.data.user);
        setEditNickname(result.data.user.nickname);
      } else {
        setError(result.message || '获取用户信息失败');
      }
    } catch (err: any) {
      setError(err.message || '获取用户信息失败');
    }
  };

  const handleUpdateProfile = async () => {
    const result = validateNickname(editNickname);
    if (!result.isValid) {
      setNicknameError(result.message);
      return;
    }
    setNicknameError('');

    try {
      const response = await userApi.updateProfile(editNickname, user.avatar);
      if (response.code === 200 && response.data) {
        setUser((prev) => ({
          ...prev,
          nickname: response.data.user.nickname,
        }));
        setIsEditing(false);
        setSuccess('个人信息更新成功');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || '更新失败');
      }
    } catch (err: any) {
      setError(err.message || '更新失败');
    }
  };

  const handleUpdatePassword = async () => {
    const oldPwdResult = validatePassword(oldPassword);
    const newPwdResult = validatePassword(newPassword);

    if (!oldPwdResult.isValid) {
      setOldPasswordError(oldPwdResult.message);
      return;
    }
    if (!newPwdResult.isValid) {
      setNewPasswordError(newPwdResult.message);
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('两次输入的密码不一致');
      return;
    }

    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    try {
      const response = await userApi.updatePassword(oldPassword, newPassword);
      if (response.code === 200) {
        setSuccess('密码修改成功');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || '密码修改失败');
      }
    } catch (err: any) {
      setError(err.message || '密码修改失败');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto" shadow="lg" radius="xl" p="lg">
        <Box className="flex items-center gap-4 mb-6">
          <Button
            type="button"
            onClick={() => router.push('/')}
            variant="outline"
            size="sm"
            leftSection={<ArrowLeft className="w-4 h-4" />}
          >
            返回
          </Button>
          <Title order={2} className="text-gray-800">
            个人中心
          </Title>
        </Box>

        {error && (
          <Alert color="red" variant="light" className="mb-4" title="提示">
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            color="green"
            variant="light"
            className="mb-4"
            title="成功"
          >
            {success}
          </Alert>
        )}

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'profile' ? 'filled' : 'outline'}
            onClick={() => setActiveTab('profile')}
            leftSection={<User className="w-4 h-4" />}
          >
            个人信息
          </Button>
          <Button
            variant={activeTab === 'password' ? 'filled' : 'outline'}
            onClick={() => setActiveTab('password')}
            leftSection={<Shield className="w-4 h-4" />}
          >
            修改密码
          </Button>
        </div>

        {activeTab === 'profile' && (
          <Box className="space-y-6">
            <Card shadow="sm" radius="md" p="md">
              <Box className="flex items-center gap-6">
                <div className="relative">
                  <Avatar
                    size="xl"
                    radius="xl"
                    src={user.avatar || undefined}
                    icon={<User className="w-10 h-10" />}
                  />
                  <Button
                    size="sm"
                    radius="full"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                    leftSection={<Camera className="w-4 h-4" />}
                    disabled
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <TextInput
                        value={editNickname}
                        onChange={(e) => {
                          setEditNickname(e.currentTarget.value);
                          setNicknameError('');
                        }}
                        onBlur={() => {
                          const result = validateNickname(editNickname);
                          setNicknameError(result.message);
                        }}
                        error={nicknameError}
                        className="w-48"
                        autoFocus
                      />
                    ) : (
                      <Title order={3} className="text-gray-800">
                        {user.nickname || '未设置昵称'}
                      </Title>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (isEditing) {
                          handleUpdateProfile();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      leftSection={
                        isEditing ? (
                          <Save className="w-4 h-4" />
                        ) : (
                          <Edit2 className="w-4 h-4" />
                        )
                      }
                    >
                      {isEditing ? '保存' : '编辑'}
                    </Button>
                  </div>
                  <Box className="flex items-center gap-2 mt-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                    <Badge color="green" variant="light">
                      已验证
                    </Badge>
                  </Box>
                </div>
              </Box>
            </Card>

            <Card shadow="sm" radius="md" p="md">
              <Title order={4} className="text-gray-700 mb-4">
                账号信息
              </Title>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">用户ID</span>
                  <span className="font-mono text-gray-700">{user.id}</span>
                </div>
                <Divider />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">注册时间</span>
                  <span className="text-gray-700">
                    {new Date().toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </Card>

            <Button
              color="red"
              variant="outline"
              fullWidth
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </Box>
        )}

        {activeTab === 'password' && (
          <Box className="space-y-4">
            <PasswordInput
              label="当前密码"
              placeholder="请输入当前密码"
              leftSection={<Shield className="w-4 h-4 text-gray-400" />}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.currentTarget.value);
                setOldPasswordError('');
              }}
              onBlur={() => {
                const result = validatePassword(oldPassword);
                setOldPasswordError(result.message);
              }}
              radius="md"
              error={oldPasswordError}
              withAsterisk
            />

            <PasswordInput
              label="新密码"
              placeholder="请输入新密码（至少6位）"
              leftSection={<Shield className="w-4 h-4 text-gray-400" />}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.currentTarget.value);
                setNewPasswordError('');
                setConfirmPasswordError('');
              }}
              onBlur={() => {
                const result = validatePassword(newPassword);
                setNewPasswordError(result.message);
              }}
              radius="md"
              error={newPasswordError}
              withAsterisk
            />

            <PasswordInput
              label="确认新密码"
              placeholder="请再次输入新密码"
              leftSection={<Shield className="w-4 h-4 text-gray-400" />}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.currentTarget.value);
                setConfirmPasswordError('');
              }}
              onBlur={() => {
                if (newPassword !== confirmPassword) {
                  setConfirmPasswordError('两次输入的密码不一致');
                }
              }}
              radius="md"
              error={confirmPasswordError}
              withAsterisk
            />

            <Button
              onClick={handleUpdatePassword}
              className="w-full h-12"
              size="lg"
              radius="md"
              rightSection={<CheckIcon className="w-4 h-4" />}
            >
              修改密码
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
}