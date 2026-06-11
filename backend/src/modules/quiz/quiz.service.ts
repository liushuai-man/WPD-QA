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
