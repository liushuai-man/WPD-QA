import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createKnowledgeDocument = async (
  title: string,
  content: string,
  source?: string,
  categoryId?: string,
  fileName?: string,
  fileType?: string,
  fileSize?: bigint
) => {
  const knowledge = await prisma.knowledgeDocument.create({
    data: {
      title,
      content,
      source,
      categoryId: categoryId ? BigInt(categoryId) : undefined,
      fileName,
      fileType,
      fileSize,
    },
  });

  return {
    success: true,
    knowledge: {
      id: String(knowledge.id),
      title: knowledge.title,
      content: knowledge.content,
      source: knowledge.source,
      categoryId: knowledge.categoryId ? String(knowledge.categoryId) : null,
      fileName: knowledge.fileName,
      fileType: knowledge.fileType,
      createdAt: knowledge.createdAt,
    },
  };
};

export const getKnowledgeDocumentById = async (id: string) => {
  const knowledge = await prisma.knowledgeDocument.findUnique({
    where: { id: BigInt(id) },
    include: { chunks: true },
  });
  if (!knowledge) {
    throw new Error('知识文档不存在');
  }
  return {
    success: true,
    knowledge: {
      id: String(knowledge.id),
      title: knowledge.title,
      content: knowledge.content,
      source: knowledge.source,
      categoryId: knowledge.categoryId ? String(knowledge.categoryId) : null,
      fileName: knowledge.fileName,
      fileType: knowledge.fileType,
      createdAt: knowledge.createdAt,
      chunks: knowledge.chunks.map((chunk) => ({
        id: String(chunk.id),
        documentId: String(chunk.documentId),
        chunkIndex: chunk.chunkIndex,
        title: chunk.title,
        content: chunk.content,
      })),
    },
  };
};

export const getAllKnowledgeDocuments = async (categoryId?: string) => {
  const where = categoryId ? { categoryId: BigInt(categoryId) } : {};
  const knowledge = await prisma.knowledgeDocument.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  const formattedKnowledge = knowledge.map((k) => ({
    id: String(k.id),
    title: k.title,
    content: k.content,
    source: k.source,
    categoryId: k.categoryId ? String(k.categoryId) : null,
    fileName: k.fileName,
    fileType: k.fileType,
    createdAt: k.createdAt,
  }));
  return { success: true, knowledge: formattedKnowledge };
};

export const updateKnowledgeDocument = async (
  id: string,
  title: string,
  content: string,
  source?: string
) => {
  const knowledge = await prisma.knowledgeDocument.update({
    where: { id: BigInt(id) },
    data: { title, content, source },
  });
  return {
    success: true,
    knowledge: {
      id: String(knowledge.id),
      title: knowledge.title,
      content: knowledge.content,
      source: knowledge.source,
      createdAt: knowledge.createdAt,
    },
  };
};

export const deleteKnowledgeDocument = async (id: string) => {
  await prisma.knowledgeDocument.delete({ where: { id: BigInt(id) } });
  return { success: true, message: '删除成功' };
};
