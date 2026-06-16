'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Container,
  Button,
  TextInput,
  Textarea,
} from '@mantine/core';
import {
  HelpCircle,
  ChevronLeft,
  MessageSquare,
  Send,
  CheckCircle,
} from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    contact: '',
  });

  const handleSubmit = () => {
    if (!form.title || !form.content) {
      return;
    }
    // 模拟提交
    setSubmitted(true);
    setForm({ title: '', content: '', contact: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

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
              <HelpCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <Title order={4} className="text-gray-800 font-semibold text-base">
                意见反馈
              </Title>
              <Text className="text-xs text-gray-500">帮助我们改进产品</Text>
            </div>
          </div>
        </Card>
      </Box>

      <Container className="max-w-md mx-auto px-4 -mt-3 space-y-4">
        {submitted && (
          <Card shadow="sm" radius="md" className="border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <Text className="font-medium">感谢您的反馈，我们会尽快处理！</Text>
            </div>
          </Card>
        )}

        <Card shadow="sm" radius="md" className="border border-gray-100 p-4">
          <Title order={5} className="text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            提交反馈
          </Title>

          <div className="space-y-4">
            <div>
              <Text className="text-gray-600 text-sm mb-2">反馈标题</Text>
              <TextInput
                placeholder="请输入反馈标题"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                radius="md"
              />
            </div>

            <div>
              <Text className="text-gray-600 text-sm mb-2">反馈内容</Text>
              <Textarea
                placeholder="请详细描述您的意见或遇到的问题..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                minRows={4}
                radius="md"
              />
            </div>

            <div>
              <Text className="text-gray-600 text-sm mb-2">联系方式（可选）</Text>
              <TextInput
                placeholder="邮箱或手机号"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                radius="md"
              />
            </div>

            <Button
              fullWidth
              radius="md"
              className="bg-green-500 hover:bg-green-600"
              onClick={handleSubmit}
              disabled={!form.title || !form.content}
              leftSection={<Send className="w-4 h-4" />}
            >
              提交反馈
            </Button>
          </div>
        </Card>

        <Card shadow="sm" radius="md" className="border border-gray-100 p-4">
          <Title order={5} className="text-gray-800 mb-3">
            反馈类型说明
          </Title>
          <div className="space-y-2">
            <Text className="text-gray-600 text-sm">
              • 功能建议 - 对新功能或改进的建议
            </Text>
            <Text className="text-gray-600 text-sm">
              • 问题反馈 - 使用中遇到的Bug或异常
            </Text>
            <Text className="text-gray-600 text-sm">
              • 内容纠错 - 知识库或题库内容错误
            </Text>
            <Text className="text-gray-600 text-sm">
              • 其他问题 - 其他需要反馈的事项
            </Text>
          </div>
        </Card>
      </Container>
    </Box>
  );
}