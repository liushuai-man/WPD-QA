import prisma from '../../lib/prisma';

export const createConversation = async (userId: string, title?: string) => {
  const conversation = await prisma.conversation.create({
    data: {
      userId: BigInt(userId),
      title,
    },
  });

  return {
    success: true,
    conversation: {
      id: String(conversation.id),
      userId: String(conversation.userId),
      title: conversation.title,
      createdAt: conversation.createdAt,
    },
  };
};

export const getConversationById = async (id: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: BigInt(id) },
    include: { messages: true },
  });

  if (!conversation) {
    throw new Error('会话不存在');
  }

  return {
    success: true,
    conversation: {
      id: String(conversation.id),
      userId: String(conversation.userId),
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages.map((msg) => ({
        id: String(msg.id),
        conversationId: String(msg.conversationId),
        role: msg.role,
        content: msg.content,
        promptTokens: msg.promptTokens,
        completionTokens: msg.completionTokens,
        createdAt: msg.createdAt,
      })),
    },
  };
};

export const getUserConversations = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: { userId: BigInt(userId) },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
      skip,
      take: limit,
    }),
    prisma.conversation.count({ where: { userId: BigInt(userId) } }),
  ]);

  const formattedConversations = conversations.map((conv) => ({
    id: String(conv.id),
    userId: String(conv.userId),
    title: conv.title || (conv.messages[0]?.content?.slice(0, 30) + '...') || '未命名会话',
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  }));

  return {
    items: formattedConversations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const createMessage = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  promptTokens?: number,
  completionTokens?: number
) => {
  const message = await prisma.message.create({
    data: {
      conversationId: BigInt(conversationId),
      role,
      content,
      promptTokens: promptTokens || 0,
      completionTokens: completionTokens || 0,
    },
  });

  return {
    success: true,
    message: {
      id: String(message.id),
      conversationId: String(message.conversationId),
      role: message.role,
      content: message.content,
      promptTokens: message.promptTokens,
      completionTokens: message.completionTokens,
      createdAt: message.createdAt,
    },
  };
};

export const deleteConversation = async (id: string) => {
  await prisma.conversation.delete({ where: { id: BigInt(id) } });
  return { success: true, message: '删除成功' };
};
