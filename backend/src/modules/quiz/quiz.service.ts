import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createQuestion = async (
  title: string,
  options: object,
  answer: string,
  analysis?: string,
  difficulty?: number,
  categoryId?: string
) => {
  const question = await prisma.question.create({
    data: {
      title,
      options,
      answer,
      analysis,
      difficulty: difficulty || 1,
      categoryId: categoryId ? BigInt(categoryId) : undefined,
    },
  });

  return {
    success: true,
    question: {
      id: String(question.id),
      title: question.title,
      options: question.options,
      answer: question.answer,
      analysis: question.analysis,
      difficulty: question.difficulty,
      categoryId: question.categoryId ? String(question.categoryId) : null,
    },
  };
};

export const getQuestionById = async (id: string) => {
  const question = await prisma.question.findUnique({
    where: { id: BigInt(id) },
  });
  if (!question) {
    throw new Error('题目不存在');
  }
  return {
    success: true,
    question: {
      id: String(question.id),
      title: question.title,
      options: question.options,
      answer: question.answer,
      analysis: question.analysis,
      difficulty: question.difficulty,
      categoryId: question.categoryId ? String(question.categoryId) : null,
    },
  };
};

export const getAllQuestions = async (categoryId?: string) => {
  const where = categoryId ? { categoryId: BigInt(categoryId) } : {};
  const questions = await prisma.question.findMany({ where });
  const formattedQuestions = questions.map((q) => ({
    id: String(q.id),
    title: q.title,
    options: q.options,
    answer: q.answer,
    analysis: q.analysis,
    difficulty: q.difficulty,
    categoryId: q.categoryId ? String(q.categoryId) : null,
  }));
  return { success: true, questions: formattedQuestions };
};

export const createQuizRecord = async (
  userId: string,
  questionId: string,
  userAnswer: string
) => {
  const question = await prisma.question.findUnique({
    where: { id: BigInt(questionId) },
  });
  if (!question) {
    throw new Error('题目不存在');
  }

  const isCorrect = userAnswer === question.answer;

  const record = await prisma.quizRecord.create({
    data: {
      userId: BigInt(userId),
      questionId: BigInt(questionId),
      userAnswer,
      isCorrect,
    },
  });

  return {
    success: true,
    record: {
      id: String(record.id),
      userId: String(record.userId),
      questionId: String(record.questionId),
      userAnswer: record.userAnswer,
      isCorrect: record.isCorrect,
      correctAnswer: question.answer,
    },
  };
};

export const getUserQuizRecords = async (userId: string) => {
  const records = await prisma.quizRecord.findMany({
    where: { userId: BigInt(userId) },
    include: { question: true },
    orderBy: { createdAt: 'desc' },
  });
  const formattedRecords = records.map((r) => ({
    id: String(r.id),
    userId: String(r.userId),
    questionId: String(r.questionId),
    userAnswer: r.userAnswer,
    isCorrect: r.isCorrect,
    createdAt: r.createdAt,
    question: r.question
      ? {
          id: String(r.question.id),
          title: r.question.title,
          options: r.question.options,
          answer: r.question.answer,
          analysis: r.question.analysis,
        }
      : null,
  }));
  return { success: true, records: formattedRecords };
};

export const getQuestions = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const questions = await prisma.question.findMany({
    where: { isDeleted: false },
    skip,
    take: limit,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.question.count({ where: { isDeleted: false } });

  const formattedQuestions = questions.map((q) => ({
    id: Number(q.id),
    title: q.title,
    options: JSON.parse(q.options as string),
    answer: q.answer,
    analysis: q.analysis,
    difficulty: q.difficulty,
    categoryId: q.categoryId ? Number(q.categoryId) : null,
    categoryName: q.category?.name || null,
    createdAt: q.createdAt.toISOString(),
  }));

  return { list: formattedQuestions, total };
};

export const submitAnswer = async (
  userId: bigint,
  questionId: number,
  answer: string
) => {
  const question = await prisma.question.findUnique({
    where: { id: BigInt(questionId), isDeleted: false },
  });

  if (!question) {
    throw new Error('题目不存在');
  }

  const isCorrect = answer === question.answer;

  const record = await prisma.quizRecord.create({
    data: {
      userId,
      questionId: BigInt(questionId),
      userAnswer: answer,
      isCorrect,
    },
  });

  if (isCorrect) {
    await prisma.userStatistics.upsert({
      where: { userId },
      update: {
        quizCount: { increment: 1 },
        correctCount: { increment: 1 },
      },
      create: {
        userId,
        quizCount: 1,
        correctCount: 1,
      },
    });
  } else {
    await prisma.userStatistics.upsert({
      where: { userId },
      update: {
        quizCount: { increment: 1 },
      },
      create: {
        userId,
        quizCount: 1,
        correctCount: 0,
      },
    });
  }

  return {
    isCorrect,
    record: {
      id: Number(record.id),
      userId: Number(record.userId),
      questionId: Number(record.questionId),
      userAnswer: record.userAnswer,
      isCorrect: record.isCorrect,
      createdAt: record.createdAt.toISOString(),
    },
  };
};

export const getWrongQuestions = async (
  userId: bigint,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const records = await prisma.quizRecord.findMany({
    where: {
      userId,
      isCorrect: false,
      isDeleted: false,
    },
    skip,
    take: limit,
    include: {
      question: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.quizRecord.count({
    where: { userId, isCorrect: false, isDeleted: false },
  });

  const wrongQuestions = records.map((record) => ({
    id: Number(record.question.id),
    title: record.question.title,
    options: JSON.parse(record.question.options as string),
    answer: record.question.answer,
    analysis: record.question.analysis,
    difficulty: record.question.difficulty,
    categoryId: record.question.categoryId
      ? Number(record.question.categoryId)
      : null,
    categoryName: record.question.category?.name || null,
    userAnswer: record.userAnswer || '',
    reviewed: false,
    createdAt: record.createdAt.toISOString(),
  }));

  return { list: wrongQuestions, total };
};

export const getQuizStatistics = async (userId: bigint) => {
  const statistics = await prisma.userStatistics.findUnique({
    where: { userId },
  });

  const totalQuestions = await prisma.question.count({
    where: { isDeleted: false },
  });

  const wrongCount = await prisma.quizRecord.count({
    where: { userId, isCorrect: false, isDeleted: false },
  });

  const correctCount = statistics?.correctCount || 0;
  const quizCount = statistics?.quizCount || 0;
  const accuracy =
    quizCount > 0 ? Math.round((correctCount / quizCount) * 100) : 0;

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    accuracy,
  };
};

export const removeFromWrongBook = async (userId: bigint, questionId: number) => {
  await prisma.quizRecord.updateMany({
    where: {
      userId,
      questionId: BigInt(questionId),
      isCorrect: false,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
};
