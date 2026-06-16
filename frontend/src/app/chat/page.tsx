'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
  TextInput,
} from '@mantine/core';
import { Send, Mic, Image, Bot, User, Clock, ArrowLeft } from 'lucide-react';
import { chatApi } from '@/services/index';
import type { Message } from '@/types';

interface ChatMessage extends Omit<Message, 'conversationId'> {
  type: 'user' | 'bot';
  conversationId?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: '您好！我是小麦病虫害智能助手。请问有什么可以帮助您的吗？',
          createdAt: new Date().toISOString(),
          role: 'assistant',
        },
      ]);
    }
  }, [conversationId]);

  const loadConversation = async (id: string) => {
    try {
      const response = await chatApi.getConversation(id);
      if (response.code === 200 && response.data) {
        const chatMessages: ChatMessage[] = response.data.messages.map(
          (msg) => ({
            ...msg,
            type: msg.role === 'user' ? 'user' : 'bot',
          })
        );
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('加载对话失败:', error);
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: '您好！我是小麦病虫害智能助手。请问有什么可以帮助您的吗？',
          createdAt: new Date().toISOString(),
          role: 'assistant',
        },
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      createdAt: new Date().toISOString(),
      role: 'user',
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    try {
      const response = await chatApi.sendMessage(
        inputValue,
        conversationId ?? undefined
      );
      if (response.code === 200 && response.data) {
        const botMessage: ChatMessage = {
          ...response.data.message,
          type: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
        createdAt: new Date().toISOString(),
        role: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
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
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <Box className="min-h-screen bg-gray-50 pb-24">
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
          <Title
            order={3}
            className="text-white text-center text-lg font-semibold"
          >
            AI问答
          </Title>
          <div className="w-8" />
        </div>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2.5 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>
              <div
                className={`max-w-[75%] ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <Card
                  className="p-3"
                  style={{
                    backgroundColor:
                      message.type === 'user' ? '#22c55e' : '#ffffff',
                    border:
                      message.type === 'user' ? 'none' : '1px solid #f3f4f6',
                  }}
                  radius="md"
                  shadow="sm"
                >
                  <Text
                    className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      message.type === 'user' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {message.content}
                  </Text>
                </Card>
                <Text className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {formatTime(message.createdAt)}
                </Text>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Container>

      <Box className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2.5">
        <Container className="max-w-md mx-auto">
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" radius="md">
              <Image className="w-5 h-5 text-gray-400" />
            </Button>
            <TextInput
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入您的问题..."
              className="flex-1"
              size="md"
              radius="md"
            />
            <Button variant="ghost" size="icon" radius="md">
              <Mic className="w-5 h-5 text-gray-400" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending}
              color="green"
              size="icon"
              radius="md"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Container>
      </Box>
    </Box>
  );
}
