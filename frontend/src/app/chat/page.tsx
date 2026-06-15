'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  TextInput,
  Box,
  Title,
  Avatar,
  Alert,
} from '@mantine/core';
import {
  Send,
  User,
  Bot,
  ArrowLeft,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import request from '@/utils/request';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是小麦病虫害智能助手，请问有什么可以帮助您的？',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setError('');
    setIsLoading(true);

    try {
      const response = await request.post('/api/chat', {
        message: inputValue.trim(),
        userId: user?.id,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data?.response || response.message || '抱歉，我无法回答这个问题。',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || '发送消息失败，请稍后重试');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，服务器暂时无法响应，请稍后再试。',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <Card className="h-screen flex flex-col shadow-none border-none rounded-none">
        <Box className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => router.push('/')}
              variant="outline"
              size="sm"
              leftSection={<ArrowLeft className="w-4 h-4" />}
            >
              返回
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <Title order={4} className="text-gray-800">智能问答</Title>
                <p className="text-xs text-gray-500">小麦病虫害诊断助手</p>
              </div>
            </div>
          </div>
          <Avatar
            size="md"
            src={user?.avatar || undefined}
            icon={<User className="w-5 h-5" />}
          />
        </Box>

        {error && (
          <Alert color="red" variant="light" className="m-4" title="提示">
            {error}
          </Alert>
        )}

        <Box className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <Avatar
                size="sm"
                icon={
                  message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )
                }
                className={
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-orange-100 text-orange-600'
                }
              />
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 rounded-tl-sm shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <TextInput
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题，例如：小麦叶片发黄怎么办？"
              radius="xl"
              className="flex-1"
              disabled={isLoading}
              rightSection={
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  radius="xl"
                  className="h-10 w-10 p-0"
                  color="orange"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              }
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </Box>
      </Card>
    </Box>
  );
}
