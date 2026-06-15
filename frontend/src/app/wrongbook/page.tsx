'use client';

import { useState } from 'react';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
  Badge,
  Chip,
} from '@mantine/core';
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';

const wrongQuestions = [
  {
    id: 1,
    question: '小麦赤霉病的主要传播途径是什么？',
    yourAnswer: 'B',
    correctAnswer: 'C',
    category: '病害防治',
    date: '2024-01-15',
    reviewed: false,
  },
  {
    id: 2,
    question: '小麦蚜虫的最佳防治时期是？',
    yourAnswer: 'A',
    correctAnswer: 'B',
    category: '虫害防治',
    date: '2024-01-14',
    reviewed: false,
  },
  {
    id: 3,
    question: '小麦白粉病的病原菌是什么？',
    yourAnswer: 'D',
    correctAnswer: 'A',
    category: '病害防治',
    date: '2024-01-13',
    reviewed: true,
  },
  {
    id: 4,
    question: '小麦纹枯病主要危害哪个生育期？',
    yourAnswer: 'C',
    correctAnswer: 'D',
    category: '病害防治',
    date: '2024-01-12',
    reviewed: false,
  },
];

const categories = ['全部', '病害防治', '虫害防治', '种植技术'];

export default function WrongBookPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [reviewedFilter, setReviewedFilter] = useState('all');

  const filteredQuestions = wrongQuestions.filter((item) => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    if (reviewedFilter === 'reviewed') return matchesCategory && item.reviewed;
    if (reviewedFilter === 'unreviewed') return matchesCategory && !item.reviewed;
    return matchesCategory;
  });

  return (
    <Box className="min-h-screen bg-gray-50 pb-20">
      <Box className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-10 pb-4">
        <Title order={3} className="text-white text-center">错题本</Title>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-4">
        <Card shadow="sm" radius="xl" p="4" className="mb-4">
          <Box className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Text className="text-2xl font-bold text-red-500">{wrongQuestions.length}</Text>
                <Text className="text-xs text-gray-500">总错题</Text>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <Text className="text-2xl font-bold text-green-500">
                  {wrongQuestions.filter((q) => q.reviewed).length}
                </Text>
                <Text className="text-xs text-gray-500">已复习</Text>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <Text className="text-2xl font-bold text-orange-500">
                  {wrongQuestions.filter((q) => !q.reviewed).length}
                </Text>
                <Text className="text-xs text-gray-500">待复习</Text>
              </div>
            </div>
          </Box>
        </Card>

        <Card shadow="sm" radius="xl" p="4" className="mb-4">
          <Box className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <Title order={5} className="text-gray-700">筛选</Title>
          </Box>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <Chip
                key={cat}
                onClick={() => setActiveCategory(cat)}
                variant={activeCategory === cat ? 'filled' : 'outline'}
                color="green"
                size="sm"
              >
                {cat}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant={reviewedFilter === 'all' ? 'filled' : 'outline'}
              color="gray"
              size="sm"
              onClick={() => setReviewedFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={reviewedFilter === 'unreviewed' ? 'filled' : 'outline'}
              color="orange"
              size="sm"
              onClick={() => setReviewedFilter('unreviewed')}
            >
              待复习
            </Button>
            <Button
              variant={reviewedFilter === 'reviewed' ? 'filled' : 'outline'}
              color="green"
              size="sm"
              onClick={() => setReviewedFilter('reviewed')}
            >
              已复习
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <Card shadow="sm" radius="xl" p="xl" className="text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <Text className="text-gray-500">暂无错题</Text>
            </Card>
          ) : (
            filteredQuestions.map((item) => (
              <Card
                key={item.id}
                shadow="sm"
                radius="xl"
                p="4"
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge color="green" variant="light" size="sm">
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {item.reviewed && (
                      <Chip variant="filled" color="green" size="xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        已复习
                      </Chip>
                    )}
                    <Text className="text-xs text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {item.date}
                    </Text>
                  </div>
                </div>
                <Text className="font-medium text-gray-800 mb-3 line-clamp-2">
                  {item.question}
                </Text>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Text className="text-gray-500">你的答案:</Text>
                    <Badge color="red" variant="light">{item.yourAnswer}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Text className="text-gray-500">正确答案:</Text>
                    <Badge color="green" variant="light">{item.correctAnswer}</Badge>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-green-500 mt-3" />
              </Card>
            ))
          )}
        </div>

        {filteredQuestions.length > 0 && (
          <Button className="w-full mt-4" color="green">
            开始复习 ({filteredQuestions.length}题)
          </Button>
        )}
      </Container>
    </Box>
  );
}
