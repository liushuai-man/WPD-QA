import prisma from '../../lib/prisma';

const CHUNK_SIZE = 500;

const splitContentIntoChunks = (
  content: string,
  title: string
): { title: string; content: string }[] => {
  const chunks: { title: string; content: string }[] = [];
  const paragraphs = content.split(/\n\n/).filter((p) => p.trim().length > 0);

  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    if (
      currentChunk.length + paragraph.length > CHUNK_SIZE &&
      currentChunk.length > 0
    ) {
      chunks.push({
        title: `${title} - 第${chunkIndex + 1}部分`,
        content: currentChunk.trim(),
      });
      currentChunk = paragraph + '\n\n';
      chunkIndex++;
    } else {
      currentChunk += paragraph + '\n\n';
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      title: `${title} - 第${chunkIndex + 1}部分`,
      content: currentChunk.trim(),
    });
  }

  return chunks;
};

export const createKnowledgeDocument = async (
  title: string,
  content: string,
  source?: string,
  categoryId?: string,
  fileName?: string,
  fileType?: string,
  fileSize?: bigint
) => {
  const chunks = splitContentIntoChunks(content, title);

  const knowledge = await prisma.knowledgeDocument.create({
    data: {
      title,
      content,
      source,
      categoryId: categoryId ? BigInt(categoryId) : undefined,
      fileName,
      fileType,
      fileSize,
      chunks: {
        create: chunks.map((chunk, index) => ({
          chunkIndex: index,
          title: chunk.title,
          content: chunk.content,
        })),
      },
    },
    include: {
      chunks: true,
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
      chunkCount: knowledge.chunks.length,
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
  const chunks = splitContentIntoChunks(content, title);

  await prisma.knowledgeChunk.deleteMany({
    where: { documentId: BigInt(id) },
  });

  const knowledge = await prisma.knowledgeDocument.update({
    where: { id: BigInt(id) },
    data: {
      title,
      content,
      source,
      chunks: {
        create: chunks.map((chunk, index) => ({
          chunkIndex: index,
          title: chunk.title,
          content: chunk.content,
        })),
      },
    },
    include: {
      chunks: true,
    },
  });
  return {
    success: true,
    knowledge: {
      id: String(knowledge.id),
      title: knowledge.title,
      content: knowledge.content,
      source: knowledge.source,
      createdAt: knowledge.createdAt,
      chunkCount: knowledge.chunks.length,
    },
  };
};

export const deleteKnowledgeDocument = async (id: string) => {
  await prisma.knowledgeDocument.delete({ where: { id: BigInt(id) } });
  return { success: true, message: '删除成功' };
};
