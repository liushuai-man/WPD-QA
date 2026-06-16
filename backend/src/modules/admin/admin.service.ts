import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Types matching frontend
export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UserForAdmin {
  id: number;
  email: string;
  nickname: string | null;
  avatar: string | null;
  chatCount: number;
  quizCount: number;
  createdAt: Date;
}

export interface KnowledgeForAdmin {
  id: number;
  title: string;
  source: string | null;
  categoryName: string | null;
  content: string | null;
  createdAt: Date;
}

export interface QuestionForAdmin {
  id: number;
  title: string;
  options: Array<{ label: string; content: string }>;
  answer: string;
  analysis: string | null;
  difficulty: number;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: Date;
}

export interface ConversationForAdmin {
  id: number;
  title: string | null;
  userId: number;
  userEmail: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Statistics {
  totalUsers: number;
  todayActiveUsers: number;
  totalChats: number;
  todayChats: number;
  totalQuiz: number;
  todayQuiz: number;
  knowledgeCount: number;
  questionCount: number;
  ragHitRate: number;
}

// ==================== 用户管理 ====================

export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  keyword?: string
): Promise<PaginationResult<UserForAdmin>> => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    isDeleted: false,
  };

  if (keyword) {
    where.OR = [
      { email: { contains: keyword, mode: 'insensitive' } },
      { nickname: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        createdAt: true,
        statistics: {
          select: {
            chatCount: true,
            quizCount: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    list: users.map((u) => ({
      id: Number(u.id),
      email: u.email,
      nickname: u.nickname,
      avatar: u.avatar,
      chatCount: u.statistics?.chatCount || 0,
      quizCount: u.statistics?.quizCount || 0,
      createdAt: u.createdAt,
    })),
    total,
    page,
    limit,
  };
};

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.update({
    where: { id: BigInt(id) },
    data: { isDeleted: true },
  });
};

// ==================== 知识库管理 ====================

export const getKnowledgeList = async (
  page: number = 1,
  limit: number = 10,
  keyword?: string
): Promise<PaginationResult<KnowledgeForAdmin>> => {
  const skip = (page - 1) * limit;

  const where: Prisma.KnowledgeDocumentWhereInput = {
    isDeleted: false,
  };

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { source: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  const [documents, total] = await Promise.all([
    prisma.knowledgeDocument.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        source: true,
        content: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.knowledgeDocument.count({ where }),
  ]);

  return {
    list: documents.map((d) => ({
      id: Number(d.id),
      title: d.title,
      source: d.source,
      categoryName: d.category?.name || null,
      content: d.content,
      createdAt: d.createdAt,
    })),
    total,
    page,
    limit,
  };
};

export const createKnowledge = async (data: {
  title: string;
  source?: string;
  content?: string;
  categoryId?: number | null;
}): Promise<KnowledgeForAdmin> => {
  const document = await prisma.knowledgeDocument.create({
    data: {
      title: data.title,
      source: data.source,
      content: data.content,
      categoryId: data.categoryId ? BigInt(data.categoryId) : null,
    },
    include: {
      category: {
        select: { name: true },
      },
    },
  });

  return {
    id: Number(document.id),
    title: document.title,
    source: document.source,
    categoryName: document.category?.name || null,
    content: document.content,
    createdAt: document.createdAt,
  };
};

export const deleteKnowledge = async (id: number): Promise<void> => {
  await prisma.knowledgeDocument.update({
    where: { id: BigInt(id) },
    data: { isDeleted: true },
  });
};

// ==================== 题库管理 ====================

export const getQuestions = async (
  page: number = 1,
  limit: number = 10,
  keyword?: string
): Promise<PaginationResult<QuestionForAdmin>> => {
  const skip = (page - 1) * limit;

  const where: Prisma.QuestionWhereInput = {
    isDeleted: false,
  };

  if (keyword) {
    where.title = { contains: keyword, mode: 'insensitive' };
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return {
    list: questions.map((q) => ({
      id: Number(q.id),
      title: q.title,
      options: q.options as Array<{ label: string; content: string }>,
      answer: q.answer,
      analysis: q.analysis,
      difficulty: q.difficulty,
      categoryId: q.categoryId ? Number(q.categoryId) : null,
      categoryName: q.category?.name || null,
      createdAt: q.createdAt,
    })),
    total,
    page,
    limit,
  };
};

export const createQuestion = async (data: {
  title: string;
  options: Array<{ label: string; content: string }>;
  answer: string;
  analysis?: string;
  difficulty?: number;
  categoryId?: number | null;
}): Promise<QuestionForAdmin> => {
  const question = await prisma.question.create({
    data: {
      title: data.title,
      options: data.options as unknown as Prisma.InputJsonValue,
      answer: data.answer,
      analysis: data.analysis,
      difficulty: data.difficulty || 1,
      categoryId: data.categoryId ? BigInt(data.categoryId) : null,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    id: Number(question.id),
    title: question.title,
    options: question.options as Array<{ label: string; content: string }>,
    answer: question.answer,
    analysis: question.analysis,
    difficulty: question.difficulty,
    categoryId: question.categoryId ? Number(question.categoryId) : null,
    categoryName: question.category?.name || null,
    createdAt: question.createdAt,
  };
};

export const updateQuestion = async (
  id: number,
  data: Partial<{
    title: string;
    options: Array<{ label: string; content: string }>;
    answer: string;
    analysis: string;
    difficulty: number;
    categoryId: number | null;
  }>
): Promise<QuestionForAdmin> => {
  const updateData: Prisma.QuestionUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.options !== undefined)
    updateData.options = data.options as unknown as Prisma.InputJsonValue;
  if (data.answer !== undefined) updateData.answer = data.answer;
  if (data.analysis !== undefined) updateData.analysis = data.analysis;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.categoryId !== undefined) {
    if (data.categoryId === null) {
      updateData.category = { disconnect: true };
    } else {
      updateData.category = { connect: { id: BigInt(data.categoryId) } };
    }
  }

  const question = await prisma.question.update({
    where: { id: BigInt(id) },
    data: updateData,
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    id: Number(question.id),
    title: question.title,
    options: question.options as Array<{ label: string; content: string }>,
    answer: question.answer,
    analysis: question.analysis,
    difficulty: question.difficulty,
    categoryId: question.categoryId ? Number(question.categoryId) : null,
    categoryName: question.category?.name || null,
    createdAt: question.createdAt,
  };
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await prisma.question.update({
    where: { id: BigInt(id) },
    data: { isDeleted: true },
  });
};

// ==================== 会话管理 ====================

export const getConversations = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginationResult<ConversationForAdmin>> => {
  const skip = (page - 1) * limit;

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: { isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true },
        },
        messages: {
          select: { id: true },
        },
      },
    }),
    prisma.conversation.count({ where: { isDeleted: false } }),
  ]);

  return {
    list: conversations.map((c) => ({
      id: Number(c.id),
      title: c.title,
      userId: Number(c.userId),
      userEmail: c.user.email,
      messageCount: c.messages.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    total,
    page,
    limit,
  };
};

export const deleteConversation = async (id: number): Promise<void> => {
  await prisma.conversation.update({
    where: { id: BigInt(id) },
    data: { isDeleted: true },
  });
};

// ==================== 统计 ====================

export const getStatistics = async (): Promise<Statistics> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    todayActiveUsers,
    totalChats,
    todayChats,
    totalQuiz,
    todayQuiz,
    knowledgeCount,
    questionCount,
  ] = await Promise.all([
    // Total users
    prisma.user.count({ where: { isDeleted: false } }),
    // Today active users (users who had messages or quiz today)
    prisma.user.count({
      where: {
        isDeleted: false,
        OR: [
          {
            conversations: {
              some: {
                createdAt: { gte: today },
              },
            },
          },
          {
            quizRecords: {
              some: {
                createdAt: { gte: today },
              },
            },
          },
        ],
      },
    }),
    // Total chats (messages)
    prisma.message.count({
      where: {
        isDeleted: false,
        conversation: { isDeleted: false },
      },
    }),
    // Today chats
    prisma.message.count({
      where: {
        isDeleted: false,
        createdAt: { gte: today },
      },
    }),
    // Total quiz records
    prisma.quizRecord.count({ where: { isDeleted: false } }),
    // Today quiz
    prisma.quizRecord.count({
      where: {
        isDeleted: false,
        createdAt: { gte: today },
      },
    }),
    // Knowledge documents count
    prisma.knowledgeDocument.count({ where: { isDeleted: false } }),
    // Questions count
    prisma.question.count({ where: { isDeleted: false } }),
  ]);

  return {
    totalUsers,
    todayActiveUsers,
    totalChats,
    todayChats,
    totalQuiz,
    todayQuiz,
    knowledgeCount,
    questionCount,
    ragHitRate: 0.85, // Placeholder - RAG hit rate would need actual tracking
  };
};
