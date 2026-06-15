'use client';

import { useState } from 'react';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
  TextInput,
} from '@mantine/core';
import { Send, Mic, Image, Bot, User, Clock } from 'lucide-react';

const mockMessages = [
  {
    id: 1,
    type: 'bot',
    content: '您好！我是小麦病虫害智能助手。请问有什么可以帮助您的吗？',
    time: '刚刚',
  },
  {
    id: 2,
    type: 'user',
    content: '小麦叶发黄是什么原因？',
    time: '刚刚',
  },
  {
    id: 3,
    type: 'bot',
    content:
      '小麦叶发黄可能由多种原因引起，主要包括：\n\n1. 营养缺乏：\n   - 缺氮：叶片均匀发黄，从老叶开始\n   - 缺镁：叶脉间发黄，叶脉仍绿\n   - 缺铁：新叶发黄，叶脉绿色\n\n2. 病害（如纹枯病）：\n   - 叶片出现黄色病斑\n   - 后期可能干枯\n\n3. 环境因素：\n   - 干旱或涝害\n   - 温度不适\n\n建议您观察具体症状，以便更准确判断。',
    time: '刚刚',
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      time: '刚刚',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <Box className="min-h-screen bg-gray-50 pb-24">
      <Box className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-10 pb-4">
        <Title
          order={3}
          className="text-white text-center text-lg font-semibold"
        >
          AI问答
        </Title>
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
                  className={`p-3 ${
                    message.type === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-gray-100'
                  }`}
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
                  {message.time}
                </Text>
              </div>
            </div>
          ))}
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
            <Button onClick={handleSend} color="green" size="icon" radius="md">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </Box>
    </Box>
  );
}
