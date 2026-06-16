'use client';

import { useState, useEffect } from 'react';
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
  HelpCircle,
} from 'lucide-react';
import { quizApi } from '@/services';
import type { Question, QuizRecord } from '@/types';

interface WrongQuestion extends Question {
  options: { label: string; content: string }[];
  userAnswer: string;
  reviewed: boolean;
  createdAt: string;
}

export default function WrongBookPage() {
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [reviewedFilter, setReviewedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchWrongQuestions();
  }, []);

  const fetchWrongQuestions = async () => {
    setLoading(true);
    try {
      const response = await quizApi.getWrongQuestions(1, 20);
      if (response.code === 200 && response.data) {
        setWrongQuestions(response.data.list);
      }
    } catch (err) {
      console.error('获取错题失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = wrongQuestions.filter((item) => {
    if (reviewedFilter === 'reviewed') return item.reviewed;
    if (reviewedFilter === 'unreviewed') return !item.reviewed;
    return true;
  });

  const handleReview = (index: number) => {
    setCurrentIndex(index);
  };

  const handleCloseReview = () => {
    setCurrentIndex(null);
  };

  const reviewingQuestion =
    currentIndex !== null ? filteredQuestions[currentIndex] : null;

  if (loading) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
      <Box className="px-4 pt-10 pb-4">
        <Title
          order={3}
          className="text-gray-800 text-center text-lg font-semibold"
        >
          错题本
        </Title>
        <Text className="text-gray-500 text-center text-sm mt-1">
          复习错题，巩固知识
        </Text>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-3">
        <Card
          shadow="sm"
          radius="md"
          p="4"
          className="mb-3 bg-gradient-to-r from-orange-500 to-amber-500"
        >
          <Box className="flex items-center justify-between">
            <div>
              <Title order={4} className="text-white text-sm font-semibold">
                错题总数
              </Title>
              <Text className="text-white/80 text-xs mt-1">
                继续努力，攻克难关
              </Text>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {wrongQuestions.length}
              </Text>
            </div>
          </Box>
        </Card>

        <Card
          shadow="sm"
          radius="md"
          p="4"
          className="mb-3 border border-gray-100"
        >
          <Box className="flex items-center gap-4">
            <div className="text-center flex-1">
              <Text className="text-2xl font-bold text-gray-800">
                {wrongQuestions.length}
              </Text>
              <Text className="text-xs text-gray-500">总错题</Text>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center flex-1">
              <Text className="text-2xl font-bold text-green-500">
                {wrongQuestions.filter((q) => q.reviewed).length}
              </Text>
              <Text className="text-xs text-gray-500">已复习</Text>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center flex-1">
              <Text className="text-2xl font-bold text-orange-500">
                {wrongQuestions.filter((q) => !q.reviewed).length}
              </Text>
              <Text className="text-xs text-gray-500">待复习</Text>
            </div>
          </Box>
        </Card>

        <Card
          shadow="sm"
          radius="md"
          p="4"
          className="mb-3 border border-gray-100"
        >
          <Box className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <Title order={5} className="text-gray-700 text-sm font-semibold">
              筛选
            </Title>
          </Box>
          <div className="flex gap-2">
            <Button
              variant={reviewedFilter === 'all' ? 'filled' : 'outline'}
              color="gray"
              size="sm"
              radius="md"
              onClick={() => setReviewedFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={reviewedFilter === 'unreviewed' ? 'filled' : 'outline'}
              color="orange"
              size="sm"
              radius="md"
              onClick={() => setReviewedFilter('unreviewed')}
            >
              待复习
            </Button>
            <Button
              variant={reviewedFilter === 'reviewed' ? 'filled' : 'outline'}
              color="green"
              size="sm"
              radius="md"
              onClick={() => setReviewedFilter('reviewed')}
            >
              已复习
            </Button>
          </div>
        </Card>

        {filteredQuestions.length === 0 ? (
          <Card
            shadow="sm"
            radius="md"
            p="4"
            className="border border-gray-100"
          >
            <div className="flex flex-col items-center justify-center py-8">
              <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
              <Text className="text-gray-400 text-sm">暂无错题记录</Text>
            </div>
          </Card>
        ) : (
          <Card
            shadow="sm"
            radius="md"
            className="border border-gray-100 overflow-hidden"
          >
            {filteredQuestions.map((item, index) => (
              <>
                <button
                  key={item.id}
                  onClick={() => handleReview(index)}
                  className="w-full flex items-start justify-between p-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge color="green" variant="light" size="xs">
                        {item.categoryName || '未分类'}
                      </Badge>
                      {item.reviewed && (
                        <Chip variant="filled" color="green" size="xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已复习
                        </Chip>
                      )}
                    </div>
                    <Text className="text-gray-800 text-sm font-medium line-clamp-2">
                      {item.title}
                    </Text>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Text className="text-gray-500">你的答案:</Text>
                        <Badge color="red" variant="light" size="xs">
                          {item.userAnswer}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Text className="text-gray-500">正确:</Text>
                        <Badge color="green" variant="light" size="xs">
                          {item.answer}
                        </Badge>
                      </div>
                    </div>
                    <Text className="text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </Text>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                </button>
                {index < filteredQuestions.length - 1 && (
                  <div className="border-t border-gray-100" />
                )}
              </>
            ))}
          </Card>
        )}

        {filteredQuestions.length > 0 && (
          <Button className="w-full mt-3" color="green" radius="md">
            开始复习 ({filteredQuestions.length}题)
          </Button>
        )}
      </Container>

      {reviewingQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card
            shadow="lg"
            radius="md"
            p="4"
            className="w-full max-w-md bg-white"
          >
            <Box className="flex items-center justify-between mb-3">
              <Title
                order={4}
                className="text-gray-800 text-base font-semibold"
              >
                错题复习
              </Title>
              <Button
                size="xs"
                variant="outline"
                color="gray"
                onClick={handleCloseReview}
              >
                关闭
              </Button>
            </Box>

            <div className="flex items-center gap-2 mb-3">
              <Badge color="green" variant="light" size="sm">
                单选题
              </Badge>
              <Badge color="blue" variant="light" size="sm">
                难度: {'★'.repeat(reviewingQuestion.difficulty)}
                {'☆'.repeat(3 - reviewingQuestion.difficulty)}
              </Badge>
            </div>

            <Title
              order={5}
              className="text-gray-800 mb-4 text-sm font-semibold"
            >
              {reviewingQuestion.title}
            </Title>

            <div className="space-y-2.5 mb-4">
              {reviewingQuestion.options.map((option) => {
                let optionClass = 'border-gray-200';
                let textClass = 'text-gray-700';

                if (option.label === reviewingQuestion.answer) {
                  optionClass = 'border-green-500 bg-green-50';
                  textClass = 'text-green-700';
                } else if (option.label === reviewingQuestion.userAnswer) {
                  optionClass = 'border-red-500 bg-red-50';
                  textClass = 'text-red-700';
                }

                return (
                  <div
                    key={option.label}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg ${optionClass}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                        option.label === reviewingQuestion.answer
                          ? 'bg-green-500 text-white'
                          : option.label === reviewingQuestion.userAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {option.label}
                    </div>
                    <Text className={`flex-1 text-sm ${textClass}`}>
                      {option.content}
                    </Text>
                  </div>
                );
              })}
            </div>

            <Card
              className="bg-green-50 border border-green-100"
              radius="md"
              p="3"
            >
              <Box className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-green-500" />
                <Title
                  order={6}
                  className="text-green-700 text-xs font-semibold"
                >
                  答案解析
                </Title>
              </Box>
              <Text className="text-gray-600 text-xs leading-relaxed">
                {reviewingQuestion.analysis || '暂无解析'}
              </Text>
              <div className="flex items-center gap-4 mt-2">
                <Text className="text-xs text-gray-500">
                  你的答案:{' '}
                  <span className="text-red-500 font-medium">
                    {reviewingQuestion.userAnswer}
                  </span>
                </Text>
                <Text className="text-xs text-gray-500">
                  正确答案:{' '}
                  <span className="text-green-500 font-medium">
                    {reviewingQuestion.answer}
                  </span>
                </Text>
              </div>
            </Card>

            <Button
              className="w-full mt-4"
              color="green"
              radius="md"
              onClick={handleCloseReview}
            >
              我知道了
            </Button>
          </Card>
        </div>
      )}
    </Box>
  );
}
