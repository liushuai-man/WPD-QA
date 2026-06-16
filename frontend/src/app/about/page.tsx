'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import {
  Info,
  ChevronLeft,
  Leaf,
  Database,
  Users,
  Award,
} from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
      <Box className="bg-gradient-to-br from-green-500 to-green-600 px-4 pt-12 pb-8">
        <Button
          variant="subtle"
          className="text-white mb-4"
          onClick={() => router.back()}
          leftSection={<ChevronLeft className="w-4 h-4" />}
        >
          返回
        </Button>
        <Card
          className="bg-white/95 backdrop-blur-sm border border-white/20"
          shadow="md"
          radius="md"
          p="4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <Title order={4} className="text-gray-800 font-semibold text-base">
                关于我们
              </Title>
              <Text className="text-xs text-gray-500">了解WPD问答系统</Text>
            </div>
          </div>
        </Card>
      </Box>

      <Container className="max-w-md mx-auto px-4 -mt-3 space-y-4">
        <Card shadow="sm" radius="md" className="border border-gray-100 p-4">
          <Title order={5} className="text-gray-800 mb-3 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" />
            项目简介
          </Title>
          <Text className="text-gray-600 text-sm leading-relaxed">
            WPD问答系统是一个智能农业知识问答平台，致力于为农业从业者提供专业的知识服务。系统集成了AI问答、知识答题、图片诊断等多种功能，帮助用户快速获取农业相关知识。
          </Text>
        </Card>

        <Card shadow="sm" radius="md" className="border border-gray-100 p-4">
          <Title order={5} className="text-gray-800 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-500" />
            核心功能
          </Title>
          <div className="space-y-2">
            <Text className="text-gray-600 text-sm">
              • AI智能问答 - 基于大语言模型的智能对话
            </Text>
            <Text className="text-gray-600 text-sm">
              • 知识答题 - 农业知识题库练习与考核
            </Text>
            <Text className="text-gray-600 text-sm">
              • 图片诊断 - 作物病虫害智能识别
            </Text>
            <Text className="text-gray-600 text-sm">
              • 知识库 - 农业技术文档与资料
            </Text>
          </div>
        </Card>

        <Card shadow="sm" radius="md" className="border border-gray-100 p-4">
          <Title order={5} className="text-gray-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            开发团队
          </Title>
          <Text className="text-gray-600 text-sm leading-relaxed">
            本系统由专业团队开发维护，团队成员具备丰富的农业信息化和人工智能开发经验。
          </Text>
        </Card>

        <Card shadow="sm" radius="md" className="border border-gray-100 p-4">
          <Title order={5} className="text-gray-800 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            版本信息
          </Title>
          <div className="space-y-2">
            <Text className="text-gray-600 text-sm">
              当前版本：v1.0.0
            </Text>
            <Text className="text-gray-600 text-sm">
              更新日期：2026年
            </Text>
          </div>
        </Card>
      </Container>
    </Box>
  );
}