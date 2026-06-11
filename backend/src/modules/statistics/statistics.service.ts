import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOverallStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalConversations = await prisma.conversation.count();
  const totalMessages = await prisma.message.count();
  const totalKnowledge = await prisma.knowledgeDocument.count();
  const totalQuestions = await prisma.question.count();

  return {
    success: true,
    stats: {
      totalUsers,
      totalConversations,
      totalMessages,
      totalKnowledge,
      totalQuestions,
    },
  };
};

export const getUserStats = async (userId: string) => {
  const userIdBigInt = BigInt(userId);
  const conversations = await prisma.conversation.count({
    where: { userId: userIdBigInt },
  });
  const messages = await prisma.message.count({
    where: { conversation: { userId: userIdBigInt } },
  });
  const quizRecords = await prisma.quizRecord.count({
    where: { userId: userIdBigInt },
  });
  const correctAnswers = await prisma.quizRecord.count({
    where: { userId: userIdBigInt, isCorrect: true },
  });

  const accuracy =
    quizRecords > 0 ? Math.round((correctAnswers / quizRecords) * 100) : 0;

  return {
    success: true,
    stats: {
      conversations,
      messages,
      quizRecords,
      correctAnswers,
      accuracy,
    },
  };
};

export const getDailyStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newUsers = await prisma.user.count({
    where: { createdAt: { gte: today } },
  });
  const newConversations = await prisma.conversation.count({
    where: { createdAt: { gte: today } },
  });
  const newMessages = await prisma.message.count({
    where: { createdAt: { gte: today } },
  });

  return {
    success: true,
    stats: {
      newUsers,
      newConversations,
      newMessages,
    },
  };
};
