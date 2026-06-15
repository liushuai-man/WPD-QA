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
  Progress,
} from '@mantine/core';
import { ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

const question = {
  id: 1,
  question: '小麦赤霉病主要危害小麦的哪个部位？',
  options: [
    { label: 'A', text: '根部' },
    { label: 'B', text: '茎部' },
    { label: 'C', text: '叶片' },
    { label: 'D', text: '穗部' },
  ],
  answer: 'D',
  analysis:
    '正确答案是D。小麦赤霉病主要危害小麦的穗部，导致穗腐。发病初期，在小穗和颖片上出现水渍状淡褐色病斑，后期产生粉红色霉层。赤霉病不仅影响产量，还会产生毒素，影响小麦品质。',
};

export default function QuizPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleSelect = (label: string) => {
    if (showResult) return;
    setSelectedOption(label);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowResult(true);
    if (selectedOption === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <Box className="min-h-screen bg-gray-50 pb-20">
      <Box className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-10 pb-4">
        <Title
          order={3}
          className="text-white text-center text-lg font-semibold"
        >
          答题练习
        </Title>
        <Box className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="light" color="white" size="sm">
            第 {currentIndex + 1}/10 题
          </Badge>
          <Badge variant="light" color="white" size="sm">
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
              难度: 中等
            </Badge>
          </div>
          <Title
            order={4}
            className="text-gray-800 mb-4 text-base font-semibold"
          >
            {question.question}
          </Title>

          <div className="space-y-2.5">
            {question.options.map((option) => {
              let optionClass =
                'border-gray-200 hover:border-green-300 hover:bg-green-50';
              if (showResult) {
                if (option.label === question.answer) {
                  optionClass = 'border-green-500 bg-green-50';
                } else if (
                  option.label === selectedOption &&
                  option.label !== question.answer
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
                      showResult && option.label === question.answer
                        ? 'bg-green-500 text-white'
                        : showResult &&
                            option.label === selectedOption &&
                            option.label !== question.answer
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
                      showResult && option.label === question.answer
                        ? 'text-green-700'
                        : showResult &&
                            option.label === selectedOption &&
                            option.label !== question.answer
                          ? 'text-red-700'
                          : 'text-gray-700'
                    }`}
                  >
                    {option.text}
                  </Text>
                  {showResult && option.label === question.answer && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {showResult &&
                    option.label === selectedOption &&
                    option.label !== question.answer && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                </button>
              );
            })}
          </div>
        </Card>

        {showResult && (
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
              {question.analysis}
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
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1"
              color="green"
              radius="md"
              rightSection={<ArrowRight className="w-4 h-4" />}
            >
              下一题
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
            value={((currentIndex + 1) / 10) * 100}
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
