'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
  Badge,
  Avatar,
} from '@mantine/core';
import {
  User,
  Edit2,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  Clock,
  Heart,
  BarChart3,
  FileText,
  Info,
  MessageCircle,
} from 'lucide-react';
import { quizApi } from '@/services';

const menuItems = [
  { id: 'history', icon: Clock, label: '历史记录', badge: '6' },
  { id: 'favorites', icon: Heart, label: '我的收藏', badge: '12' },
  { id: 'quiz', icon: BarChart3, label: '学习统计' },
  { id: 'wrongbook', icon: FileText, label: '错题本', badge: '4' },
  { id: 'settings', icon: Settings, label: '设置' },
  { id: 'about', icon: Info, label: '关于我们' },
  { id: 'help', icon: HelpCircle, label: '意见反馈' },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('麦田守护者');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: '问答次数', value: '0', icon: MessageCircle },
    { label: '答题数', value: '0', icon: FileText },
    { label: '正确率', value: '0%', icon: BarChart3 },
    { label: '错题数', value: '0', icon: Heart },
  ]);
  const router = useRouter();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await quizApi.getStatistics();
      if (response.code === 200 && response.data) {
        const { totalQuestions, correctCount, wrongCount, accuracy } = response.data;
        setStats([
          { label: '题库总量', value: String(totalQuestions), icon: FileText },
          { label: '答题数', value: String(correctCount + wrongCount), icon: MessageCircle },
          { label: '正确率', value: `${accuracy}%`, icon: BarChart3 },
          { label: '错题数', value: String(wrongCount), icon: Heart },
        ]);
      }
    } catch (err) {
      console.error('获取统计数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (id: string) => {
    if (id === 'history') router.push('/history');
    else if (id === 'quiz') router.push('/quiz');
    else if (id === 'wrongbook') router.push('/wrongbook');
    else if (id === 'favorites') router.push('/favorites');
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
          <Box className="flex items-center gap-3">
            <Avatar
              size="lg"
              radius="xl"
              className="border-3 border-green-100 bg-green-100"
            >
              <User className="w-8 h-8 text-green-500" />
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                  autoFocus
                />
              ) : (
                <Title
                  order={4}
                  className="text-gray-800 font-semibold text-base"
                >
                  {nickname}
                </Title>
              )}
              <Box className="flex items-center gap-2 mt-1">
                <Badge size="xs" color="green" variant="light">
                  农户
                </Badge>
                <Text className="text-xs text-gray-500">ID: 123456789</Text>
              </Box>
            </div>
            <Button
              size="xs"
              variant="outline"
              radius="md"
              onClick={() => setIsEditing(!isEditing)}
              leftSection={<Edit2 className="w-4 h-4" />}
            >
              {isEditing ? '保存' : '编辑'}
            </Button>
          </Box>
        </Card>
      </Box>

      <Container className="max-w-md mx-auto px-4 -mt-3 space-y-3.5">
        <Card shadow="sm" radius="md" p="4" className="border border-gray-100">
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green-500" />
                  </div>
                  <Text className="text-lg font-bold text-gray-800">
                    {stat.value}
                  </Text>
                  <Text className="text-xs text-gray-500">{stat.label}</Text>
                </button>
              );
            })}
          </div>
        </Card>

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
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge color="green" variant="light" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
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
          onClick={() => router.push('/login')}
          leftSection={<LogOut className="w-4 h-4" />}
        >
          退出登录
        </Button>
      </Container>
    </Box>
  );
}
