'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
} from '@mantine/core';
import {
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useUserStore';

const menuItems = [
  { id: 'about', icon: Info, label: '关于我们' },
  { id: 'help', icon: HelpCircle, label: '意见反馈' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white flex items-center justify-center">
        <Card shadow="md" radius="md" p="8" className="text-center">
          <Text className="text-gray-600 mb-4">请先登录</Text>
          <Button onClick={() => router.push('/login')}>立即登录</Button>
        </Card>
      </Box>
    );
  }

  const handleMenuClick = (id: string) => {
    if (id === 'about') {
      router.push('/about');
    } else if (id === 'help') {
      router.push('/help');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
      <Box className="bg-gradient-to-br from-green-500 to-green-600 px-4 pt-12 pb-8">
        <Card
          className="bg-white/95 backdrop-blur-sm border border-white/20"
          shadow="md"
          radius="md"
          p="4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <Title order={4} className="text-gray-800 font-semibold text-base">
                设置
              </Title>
              <Text className="text-xs text-gray-500">管理账户与系统设置</Text>
            </div>
          </div>
        </Card>
      </Box>

      <Container className="max-w-md mx-auto px-4 -mt-3 space-y-3.5">
        <Card
          shadow="sm"
          radius="md"
          className="border border-gray-100 overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <>
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-md flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-green-500" />
                    </div>
                    <Text className="text-gray-800 font-medium text-sm">
                      {item.label}
                    </Text>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                {index < menuItems.length - 1 && (
                  <div className="border-t border-gray-100" />
                )}
              </>
            );
          })}
        </Card>

        <Button
          color="red"
          variant="outline"
          fullWidth
          radius="md"
          onClick={handleLogout}
          leftSection={<LogOut className="w-4 h-4" />}
        >
          退出登录
        </Button>

        <Text className="text-center text-xs text-gray-400 mt-2">
          其它功能有待开发
        </Text>
      </Container>
    </Box>
  );
}
