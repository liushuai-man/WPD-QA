'use client';

import { useRouter } from 'next/navigation';
import { Card, Box, Title, Text, Button, Container } from '@mantine/core';
import {
  MessageCircle,
  Bug,
  BookOpen,
  Camera,
  Clock,
  ArrowRight,
  Wheat,
  Shield,
  HelpCircle,
  FileText,
} from 'lucide-react';

const features = [
  { id: 'chat', icon: MessageCircle, label: 'AI问答', color: 'bg-green-500' },
  { id: 'quiz', icon: Bug, label: '知识答题', color: 'bg-blue-500' },
  { id: 'diagnose', icon: Camera, label: '图片诊断', color: 'bg-orange-500' },
  { id: 'knowledge', icon: BookOpen, label: '知识库', color: 'bg-purple-500' },
  { id: 'history', icon: Clock, label: '历史会话', color: 'bg-cyan-500' },
  { id: 'wrongbook', icon: FileText, label: '错题本', color: 'bg-red-500' },
];

export default function HomePage() {
  const router = useRouter();

  const handleFeatureClick = (id: string) => {
    if (id === 'chat') router.push('/chat');
    else if (id === 'knowledge') router.push('/knowledge');
    else if (id === 'quiz') router.push('/quiz');
    else if (id === 'diagnose') router.push('/diagnose');
    else if (id === 'history') router.push('/history');
    else if (id === 'wrongbook') router.push('/wrongbook');
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
      <Box className="px-4 pt-10 pb-8">
        <Box className="flex items-center justify-between mb-6">
          <Box className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <div>
              <Title order={3} className="text-gray-800 font-bold text-lg">
                麦医生
              </Title>
              <Text className="text-gray-500 text-xs">
                小麦病虫害智能问答系统
              </Text>
            </div>
          </Box>
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Shield className="w-4.5 h-4.5 text-gray-500" />
          </div>
        </Box>

        <Card
          className="bg-white shadow-md cursor-pointer border border-gray-100"
          radius="md"
          p="0"
          onClick={() => router.push('/chat')}
        >
          <Box className="relative h-32 bg-gradient-to-r from-amber-50 to-green-100 rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=400&h=140&fit=crop"
              alt="小麦"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Title order={4} className="text-white font-bold text-lg">
                AI智能问答
              </Title>
              <Text className="text-white/80 text-xs mt-1">
                专业解答小麦病虫害问题
              </Text>
            </div>
          </Box>
          <Box className="p-4 flex items-center justify-between border-t border-gray-100">
            <Text className="text-gray-600 text-sm">点击立即咨询</Text>
            <Button
              size="sm"
              color="green"
              radius="md"
              rightSection={<ArrowRight className="w-4 h-4" />}
            >
              立即咨询
            </Button>
          </Box>
        </Card>
      </Box>

      <Container className="max-w-md mx-auto px-4 space-y-4">
        <Card shadow="sm" radius="md" p="4" className="border border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Text className="text-xs text-gray-600">{feature.label}</Text>
                </button>
              );
            })}
          </div>
        </Card>

        <Card shadow="sm" radius="md" p="4" className="border border-gray-100">
          <Box className="flex items-center justify-between mb-3">
            <Title order={4} className="text-gray-800 text-base font-semibold">
              热门问题
            </Title>
            <Button
              size="xs"
              variant="link"
              color="green"
              className="h-auto px-2"
            >
              换一换
            </Button>
          </Box>
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
            <HelpCircle className="w-10 h-10 text-gray-300 mb-3" />
            <Text className="text-gray-400 text-sm">功能开发中，敬请期待</Text>
          </div>
        </Card>
      </Container>
    </Box>
  );
}
