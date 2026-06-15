'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Box,
  Title,
  Text,
  Badge,
  Container,
} from '@mantine/core';
import {
  MessageCircle,
  BookOpen,
  BarChart3,
  HelpCircle,
  ArrowRight,
  Wheat,
  Bug,
  Leaf,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  const features = [
    {
      icon: Wheat,
      title: '智能问答',
      description: '基于AI的小麦病虫害智能问答系统，快速解答您的疑问',
      color: 'orange',
    },
    {
      icon: Bug,
      title: '病虫害识别',
      description: '提供病虫害识别功能，帮助您快速诊断作物问题',
      color: 'red',
    },
    {
      icon: Leaf,
      title: '知识库',
      description: '丰富的农业知识库，涵盖小麦种植的各个方面',
      color: 'green',
    },
    {
      icon: BarChart3,
      title: '学习测验',
      description: '交互式学习测验，检验您的知识掌握程度',
      color: 'blue',
    },
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Container className="max-w-6xl" py="xl">
        <Box className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <Wheat className="w-10 h-10 text-orange-600" />
          </div>
          <Title order={1} className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            小麦病虫害智能问答平台
          </Title>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            专业的小麦病虫害诊断与学习平台，助力农业生产智能化
          </Text>
          <Badge color="orange" variant="light" className="mt-4">
            农业智能助手
          </Badge>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <Card
              key={feature.title}
              shadow="sm"
              radius="xl"
              p="lg"
              className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => {
                if (!isLoggedIn) {
                  router.push('/login');
                  return;
                }
                if (feature.title === '智能问答') {
                  router.push('/chat');
                } else if (feature.title === '学习测验') {
                  router.push('/quiz');
                }
              }}
            >
              <Box className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center`}
                  style={{
                    backgroundColor: `${feature.color === 'orange' ? '#fef3c7' :
                      feature.color === 'red' ? '#fee2e2' :
                      feature.color === 'green' ? '#dcfce7' : '#dbeafe'}`,
                  }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{
                      color: `${feature.color === 'orange' ? '#ea580c' :
                        feature.color === 'red' ? '#dc2626' :
                        feature.color === 'green' ? '#16a34a' : '#2563eb'}`,
                    }}
                  />
                </div>
                <div>
                  <Title order={4} className="text-gray-800 mb-1">
                    {feature.title}
                  </Title>
                  <Text className="text-gray-500 text-sm">
                    {feature.description}
                  </Text>
                </div>
              </Box>
            </Card>
          ))}
        </Box>

        <Card
          shadow="lg"
          radius="xl"
          p="xl"
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
        >
          <Box className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Title order={2} className="text-white mb-2">
                开始智能问答之旅
              </Title>
              <Text className="text-orange-100">
                立即体验AI驱动的小麦病虫害诊断服务
              </Text>
            </div>
            <div className="flex gap-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    onClick={() => router.push('/login')}
                    variant="outline"
                    color="white"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-orange-500"
                    leftSection={<MessageCircle className="w-4 h-4" />}
                  >
                    登录
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    variant="filled"
                    color="white"
                    className="bg-white text-orange-500 hover:bg-orange-50"
                    rightSection={<ArrowRight className="w-4 h-4" />}
                  >
                    免费注册
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push('/chat')}
                  variant="filled"
                  color="white"
                  className="bg-white text-orange-500 hover:bg-orange-50"
                  rightSection={<ArrowRight className="w-4 h-4" />}
                >
                  进入问答
                </Button>
              )}
            </div>
          </Box>
        </Card>

        <Box className="mt-12 text-center">
          <Title order={3} className="text-gray-800 mb-8">
            平台特点
          </Title>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card shadow="none" radius="xl" p="lg" className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <Title order={4} className="text-gray-800 mb-2">
                数据安全
              </Title>
              <Text className="text-gray-500 text-sm">
                采用先进的加密技术，保障您的数据安全
              </Text>
            </Card>
            <Card shadow="none" radius="xl" p="lg" className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <Title order={4} className="text-gray-800 mb-2">
                专业知识
              </Title>
              <Text className="text-gray-500 text-sm">
                由农业专家提供的专业知识支持
              </Text>
            </Card>
            <Card shadow="none" radius="xl" p="lg" className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
              <Title order={4} className="text-gray-800 mb-2">
                贴心服务
              </Title>
              <Text className="text-gray-500 text-sm">
                7x24小时全天候智能问答服务
              </Text>
            </Card>
          </Box>
        </Box>

        <Box className="mt-12 text-center text-gray-400 text-sm">
          <p>© 2024 小麦病虫害智能问答平台 - 助力农业智能化发展</p>
        </Box>
      </Container>
    </Box>
  );
}