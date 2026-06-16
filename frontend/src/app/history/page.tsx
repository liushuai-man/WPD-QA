'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Box, Title, Text, Button, Container } from '@mantine/core';
import { Clock, ArrowRight, Trash2, MoreVertical, ArrowLeft } from 'lucide-react';
import { chatApi } from '@/services/index';
import type { Conversation } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getConversations(1, 20);
      if (response.code === 200 && response.data) {
        setConversations(response.data.items);
      }
    } catch (error) {
      console.error('加载历史会话失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定要删除这个会话吗？')) return;

    try {
      const response = await chatApi.deleteConversation(id);
      if (response.code === 200) {
        setConversations(conversations.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('删除会话失败:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 1) return '今天';
    if (days < 2) return '昨天';
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50 pb-20">
      <Box className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Title order={3} className="text-white text-center">
            历史会话
          </Title>
          <div className="w-8" />
        </div>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              shadow="sm"
              radius="xl"
              p="4"
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/chat?id=${conversation.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Text className="font-medium text-gray-800 truncate">
                    {conversation.title}
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <Text className="text-xs text-gray-400">
                      {formatTime(conversation.updatedAt)}
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(conversation.id, e)}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-500 mt-3" />
            </Card>
          ))}
        </div>

        {conversations.length === 0 && (
          <Card shadow="sm" radius="xl" p="xl" className="text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <Text className="text-gray-500">暂无历史会话</Text>
            <Button color="green" mt-4 onClick={() => router.push('/chat')}>
              开始对话
            </Button>
          </Card>
        )}
      </Container>
    </Box>
  );
}