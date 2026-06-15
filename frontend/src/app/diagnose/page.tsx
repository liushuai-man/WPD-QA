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
} from '@mantine/core';
import {
  Camera,
  Image,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const diagnosisHistory = [
  { id: 1, date: '2024-01-15 14:30', result: '小麦赤霉病', confidence: '85%', status: '已诊断' },
  { id: 2, date: '2024-01-14 09:20', result: '小麦白粉病', confidence: '78%', status: '已诊断' },
  { id: 3, date: '2024-01-13 16:45', result: '正常叶片', confidence: '92%', status: '已诊断' },
];

export default function DiagnosePage() {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleUpload = () => {
    setImageUploaded(true);
    setIsDiagnosing(true);
    
    setTimeout(() => {
      setIsDiagnosing(false);
    }, 3000);
  };

  return (
    <Box className="min-h-screen bg-gray-50 pb-20">
      <Box className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-10 pb-4">
        <Title order={3} className="text-white text-center">图片诊断</Title>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-4 space-y-4">
        <Card shadow="sm" radius="xl" p="4">
          <Title order={4} className="text-gray-800 mb-4">上传图片</Title>
          
          {!imageUploaded ? (
            <button
              onClick={handleUpload}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-400 transition-colors"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Camera className="w-8 h-8 text-green-500" />
              </div>
              <Text className="text-gray-600 font-medium">点击上传小麦病害图片</Text>
              <Text className="text-gray-400 text-sm mt-1">支持 JPG、PNG 格式</Text>
            </button>
          ) : (
            <Box className="relative">
              <img
                src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=400&h=300&fit=crop"
                alt="上传的图片"
                className="w-full h-48 object-cover rounded-xl"
              />
              {isDiagnosing && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <Box className="text-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <Text className="text-white">诊断中...</Text>
                  </Box>
                </div>
              )}
              {!isDiagnosing && (
                <Badge className="absolute top-2 right-2" color="green" variant="light">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  诊断完成
                </Badge>
              )}
            </Box>
          )}

          {imageUploaded && !isDiagnosing && (
            <Box className="mt-4 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-green-500" />
                <Title order={5} className="text-green-700">诊断结果</Title>
              </div>
              <Text className="text-gray-600 text-sm">
                <strong>病害名称：</strong>小麦赤霉病
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                <strong>置信度：</strong>85%
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                <strong>建议：</strong>及时喷施杀菌剂进行防治，注意田间排水。
              </Text>
            </Box>
          )}

          {imageUploaded && (
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setImageUploaded(false)}>
                重新上传
              </Button>
              <Button color="green" className="flex-1">
                保存结果
              </Button>
            </div>
          )}
        </Card>

        <Card shadow="sm" radius="xl" p="4">
          <Box className="flex items-center justify-between mb-4">
            <Title order={4} className="text-gray-800">诊断记录</Title>
            <Button size="sm" variant="link" color="green">查看全部</Button>
          </Box>
          <div className="space-y-3">
            {diagnosisHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <Text className="font-medium text-gray-800">{item.result}</Text>
                  <Text className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </Text>
                </div>
                <Badge color="green" variant="light" size="sm">
                  {item.confidence}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card shadow="sm" radius="xl" p="4" className="bg-blue-50">
          <Title order={5} className="text-gray-800 mb-2">拍摄提示</Title>
          <Text className="text-gray-600 text-sm">
            1. 请确保图片清晰，光线充足
          </Text>
          <Text className="text-gray-600 text-sm mt-1">
            2. 尽量拍摄单个叶片或麦穗
          </Text>
          <Text className="text-gray-600 text-sm mt-1">
            3. 保持拍摄距离适中，不要太远或太近
          </Text>
          <Text className="text-gray-600 text-sm mt-1">
            4. 避免阴影和反光
          </Text>
        </Card>
      </Container>
    </Box>
  );
}
