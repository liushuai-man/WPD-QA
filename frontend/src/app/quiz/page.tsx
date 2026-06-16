'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  Box,
  Title,
  Text,
  Button,
  Container,
  Badge,
  Progress,
} from '@mantine/core';
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Home,
  Trophy,
} from 'lucide-react';
import { quizApi } from '@/services';
import type { Question, QuizRecord } from '@/types/index';

interface QuizQuestion extends Question {
  options: { label: string; content: string }[];
  userAnswer?: string;
}

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get('mode') === 'review';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wrongAnswers, setWrongAnswers] = useState<QuizRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [correctIds, setCorrectIds] = useState<number[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let response;
      if (isReviewMode) {
        response = await quizApi.getWrongQuestions(1, 50);
      } else {
        response = await quizApi.getQuestions(1, 10);
      }
      if (response.code === 200 && response.data) {
        setQuestions(response.data.list);
      }
    } catch (err) {
      console.error('获取题目失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (label: string) => {
    if (showResult) return;
    setSelectedOption(label);
  };

  const handleSubmit = async () => {
    if (!selectedOption || !questions[currentIndex]) return;

    setShowResult(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    if (isCorrect) {
      setScore(score + 1);
      if (isReviewMode) {
        setCorrectIds([...correctIds, Number(currentQuestion.id)]);
      }
    } else {
      setWrongAnswers([
        ...wrongAnswers,
        {
          questionId: Number(currentQuestion.id),
          userAnswer: selectedOption,
          isCorrect: false,
        } as QuizRecord,
      ]);
    }

    try {
      await quizApi.submitAnswer(Number(currentQuestion.id), selectedOption);
      if (isCorrect && isReviewMode) {
        await quizApi.removeFromWrongBook(Number(currentQuestion.id));
      }
    } catch (err) {
      console.error('提交答案失败:', err);
    }
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setIsFinished(true);
      return;
    }
    setSelectedOption(null);
    setShowResult(false);
    setCurrentIndex(currentIndex + 1);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
        <Box className="px-4 pt-10 pb-4">
          <Title
            order={3}
            className="text-gray-800 text-center text-lg font-semibold"
          >
            答题练习
          </Title>
        </Box>
        <Container className="max-w-md mx-auto px-4 py-3">
          <Card
            shadow="sm"
            radius="md"
            p="4"
            className="border border-gray-100"
          >
            <div className="flex flex-col items-center justify-center py-8">
              <HelpCircle className="w-10 h-10 text-gray-300 mb-3" />
              <Text className="text-gray-400 text-sm">暂无题目数据</Text>
            </div>
          </Card>
        </Container>
      </Box>
    );
  }

  if (isFinished) {
    const accuracy =
      questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white py-20">
        <Container className="max-w-md mx-auto px-4">
          <Card
            shadow="lg"
            radius="lg"
            p="6"
            className="text-center border border-gray-100"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <Title order={2} className="text-gray-800 text-xl font-bold mb-2">
              答题完成！
            </Title>
            <Text className="text-gray-500 text-sm mb-6">
              恭喜你完成本次答题
            </Text>

            <Card
              shadow="sm"
              radius="md"
              p="4"
              className="bg-gradient-to-r from-green-500 to-green-600 mb-6"
            >
              <Text className="text-white text-sm mb-1">本次得分</Text>
              <div className="text-white text-5xl font-bold">
                {score}
                <span className="text-xl font-normal">/{questions.length}</span>
              </div>
              <Text className="text-white/80 text-sm mt-1">
                正确率: {accuracy}%
              </Text>
            </Card>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card
                shadow="sm"
                radius="md"
                p="3"
                className="border border-gray-100"
              >
                <Text className="text-gray-500 text-xs mb-1">总题数</Text>
                <Text className="text-gray-800 text-lg font-semibold">
                  {questions.length}
                </Text>
              </Card>
              <Card
                shadow="sm"
                radius="md"
                p="3"
                className="border border-gray-100"
              >
                <Text className="text-gray-500 text-xs mb-1">正确</Text>
                <Text className="text-green-600 text-lg font-semibold">
                  {score}
                </Text>
              </Card>
              <Card
                shadow="sm"
                radius="md"
                p="3"
                className="border border-gray-100"
              >
                <Text className="text-gray-500 text-xs mb-1">错误</Text>
                <Text className="text-red-600 text-lg font-semibold">
                  {questions.length - score}
                </Text>
              </Card>
            </div>

            <Button
              onClick={handleBackToHome}
              className="w-full"
              color="green"
              radius="md"
              leftSection={<Home className="w-4 h-4" />}
            >
              返回首页
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Box className="min-h-screen bg-gradient-to-b from-sky-100 via-gray-50 to-white pb-20">
      <Box className="px-4 pt-10 pb-4">
        <Title
          order={3}
          className="text-gray-800 text-center text-lg font-semibold"
        >
          答题练习
        </Title>
        <Box className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="light" color="green" size="sm">
            第 {currentIndex + 1}/{questions.length} 题
          </Badge>
          <Badge variant="light" color="blue" size="sm">
            得分: {score}
          </Badge>
        </Box>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-3">
        <Card
          shadow="sm"
          radius="md"
          p="4"
          className="mb-3 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Badge color="green" variant="light" size="sm">
              单选题
            </Badge>
            <Badge color="blue" variant="light" size="sm">
              难度: {'★'.repeat(currentQuestion.difficulty)}
              {'☆'.repeat(3 - currentQuestion.difficulty)}
            </Badge>
          </div>
          <Title
            order={4}
            className="text-gray-800 mb-4 text-base font-semibold"
          >
            {currentQuestion.title}
          </Title>

          <div className="space-y-2.5">
            {currentQuestion.options.map((option) => {
              let optionClass =
                'border-gray-200 hover:border-green-300 hover:bg-green-50';
              if (showResult) {
                if (option.label === currentQuestion.answer) {
                  optionClass = 'border-green-500 bg-green-50';
                } else if (
                  option.label === selectedOption &&
                  option.label !== currentQuestion.answer
                ) {
                  optionClass = 'border-red-500 bg-red-50';
                }
              } else if (selectedOption === option.label) {
                optionClass = 'border-green-500 bg-green-50';
              }

              return (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.label)}
                  disabled={showResult}
                  className={`w-full flex items-center gap-3 p-3.5 border-2 rounded-lg transition-all ${optionClass}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                      showResult && option.label === currentQuestion.answer
                        ? 'bg-green-500 text-white'
                        : showResult &&
                            option.label === selectedOption &&
                            option.label !== currentQuestion.answer
                          ? 'bg-red-500 text-white'
                          : selectedOption === option.label
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {option.label}
                  </div>
                  <Text
                    className={`flex-1 text-sm ${
                      showResult && option.label === currentQuestion.answer
                        ? 'text-green-700'
                        : showResult &&
                            option.label === selectedOption &&
                            option.label !== currentQuestion.answer
                          ? 'text-red-700'
                          : 'text-gray-700'
                    }`}
                  >
                    {option.content}
                  </Text>
                  {showResult && option.label === currentQuestion.answer && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {showResult &&
                    option.label === selectedOption &&
                    option.label !== currentQuestion.answer && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                </button>
              );
            })}
          </div>
        </Card>

        {showResult && currentQuestion.analysis && (
          <Card
            shadow="sm"
            radius="md"
            p="4"
            className="mb-3 bg-green-50 border border-green-100"
          >
            <Box className="flex items-center gap-2 mb-2.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <Title order={5} className="text-green-700 text-sm font-semibold">
                答案解析
              </Title>
            </Box>
            <Text className="text-gray-600 text-sm leading-relaxed">
              {currentQuestion.analysis}
            </Text>
          </Card>
        )}

        <Box className="flex gap-2.5">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="flex-1"
              color="green"
              radius="md"
              rightSection={<ArrowRight className="w-4 h-4" />}
            >
              提交答案
            </Button>
          ) : currentIndex < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1"
              color="green"
              radius="md"
              rightSection={<ArrowRight className="w-4 h-4" />}
            >
              下一题
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1"
              color="green"
              radius="md"
            >
              完成答题
            </Button>
          )}
        </Box>

        <Card
          shadow="sm"
          radius="md"
          p="4"
          className="mt-3 border border-gray-100"
        >
          <Title order={5} className="text-gray-700 mb-3 text-sm font-semibold">
            答题进度
          </Title>
          <Progress
            value={((currentIndex + 1) / questions.length) * 100}
            color="green"
            size="sm"
          />
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <Text className="text-xs text-gray-500">用时: 02:35</Text>
            </div>
            <Text className="text-xs text-gray-500">
              正确率: {score}/{currentIndex + 1}
            </Text>
          </div>
        </Card>
      </Container>
    </Box>
  );
}
