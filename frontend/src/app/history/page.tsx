'use client';

import { useRouter } from 'next/navigation';
import { Card, Box, Title, Text, Button, Container } from '@mantine/core';
import { Clock, ArrowRight, Trash2, MoreVertical } from 'lucide-react';

const historyItems = [
  { id: 1, title: '小麦叶发黄是什么原因？', time: '今天 09:30', messages: 3 },
  { id: 2, title: '小麦赤霉病如何防治？', time: '昨天 14:20', messages: 5 },
  { id: 3, title: '小麦病虫害有哪些种类？', time: '3天前', messages: 8 },
  { id: 4, title: '小麦蚜虫怎么防治？', time: '5天前', messages: 4 },
  { id: 5, title: '小麦白粉病防治要点', time: '7天前', messages: 6 },
  { id: 6, title: '小麦追肥注意事项', time: '7天前', messages: 2 },
];

export default function HistoryPage() {
  const router = useRouter();

  return (
    <Box className="min-h-screen bg-gray-50 pb-20">
      <Box className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-10 pb-4">
        <Title order={3} className="text-white text-center">
          历史会话
        </Title>
      </Box>

      <Container className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-3">
          {historyItems.map((item) => (
            <Card
              key={item.id}
              shadow="sm"
              radius="xl"
              p="4"
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/chat')}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Text className="font-medium text-gray-800 truncate">
                    {item.title}
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <Text className="text-xs text-gray-400">{item.time}</Text>
                    <Text className="text-xs text-gray-400">
                      | {item.messages}条消息
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
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

        {historyItems.length === 0 && (
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
