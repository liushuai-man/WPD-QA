'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
  Input,
  Badge,
} from '@mantine/core';
import {
  Search,
  BookOpen,
  BarChart3,
  Clock,
  ArrowRight,
  Star,
  Bug,
  Leaf,
  Shield,
  HelpCircle,
} from 'lucide-react';

const knowledgeCategories = [
  { id: 'disease', icon: Bug, label: '病害防治', count: 28 },
  { id: 'pest', icon: Shield, label: '虫害防治', count: 18 },
  { id: 'planting', icon: Leaf, label: '种植技术', count: 35 },
  { id: 'nutrition', icon: Star, label: '营养管理', count: 12 },
];

const dailyStats = {
  today: 128,
  accuracy: '86%',
  streak: 5,
  total: 12,
};

export default function KnowledgePage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const router = useRouter();

  return (
    <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
      <Box className="px-4 pt-10 pb-4">
        <Title
          order={3}
          className="text-gray-800 text-center text-lg font-semibold"
        >
          学习中心
        </Title>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-3 space-y-3.5">
        <Card
          className="bg-gradient-to-r from-orange-500 to-amber-500"
          radius="md"
          p="4"
        >
          <Box className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <Title order={4} className="text-white text-sm font-semibold">
                每日一练
              </Title>
              <Text className="text-white/80 text-xs">每天进步一点点</Text>
            </div>
            <Button
              variant="outline"
              color="white"
              size="sm"
              radius="md"
              onClick={() => router.push('/quiz')}
            >
              开始练习
            </Button>
          </Box>
        </Card>

        <Card shadow="sm" radius="md" p="4" className="border border-gray-100">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <Text className="text-xl font-bold text-green-500">
                {dailyStats.today}
              </Text>
              <Text className="text-xs text-gray-500">今日学习</Text>
            </div>
            <div className="text-center">
              <Text className="text-xl font-bold text-blue-500">
                {dailyStats.accuracy}
              </Text>
              <Text className="text-xs text-gray-500">正确率</Text>
            </div>
            <div className="text-center">
              <Text className="text-xl font-bold text-orange-500">
                {dailyStats.streak}
              </Text>
              <Text className="text-xs text-gray-500">连续天数</Text>
            </div>
            <div className="text-center">
              <Text className="text-xl font-bold text-purple-500">
                {dailyStats.total}
              </Text>
              <Text className="text-xs text-gray-500">累计学习</Text>
            </div>
          </div>
        </Card>

        <Card shadow="sm" radius="md" p="4" className="border border-gray-100">
          <Title
            order={4}
            className="text-gray-800 mb-3 text-base font-semibold"
          >
            知识分类
          </Title>
          <div className="grid grid-cols-2 gap-2.5">
            {knowledgeCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-md flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-green-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <Text className="text-sm font-medium text-gray-800">
                      {category.label}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {category.count}篇
                    </Text>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </div>
        </Card>

        <Box className="flex items-center justify-between mb-2">
          <Title order={4} className="text-gray-800 text-base font-semibold">
            热门知识
          </Title>
          <Button
            size="xs"
            variant="link"
            color="green"
            className="h-auto px-2"
          >
            更多
          </Button>
        </Box>
        <Card shadow="sm" radius="md" p="4" className="border border-gray-100">
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
            <HelpCircle className="w-10 h-10 text-gray-300 mb-3" />
            <Text className="text-gray-400 text-sm">功能开发中，敬请期待</Text>
          </div>
        </Card>
      </Container>
    </Box>
  );
}
