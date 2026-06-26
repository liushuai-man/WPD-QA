import prisma from '../../lib/prisma';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  documentId: string;
  score: number;
}

const extractNGrams = (text: string): string[] => {
  const ngrams: string[] = [];
  const cleanedText = text.replace(/[\s,，。、！？；：]/g, '');

  for (let i = 0; i < cleanedText.length; i++) {
    for (let n = 2; n <= 4 && i + n <= cleanedText.length; n++) {
      ngrams.push(cleanedText.substring(i, i + n));
    }
  }

  const uniqueNGrams = [...new Set(ngrams)];
  return uniqueNGrams.filter((g) => g.length >= 2);
};

export const searchKnowledge = async (
  query: string,
  topK: number = 3
): Promise<SearchResult[]> => {
  try {
    const keywords = extractNGrams(query);

    if (keywords.length === 0) {
      return [];
    }

    const chunks = await prisma.knowledgeChunk.findMany({
      where: {
        isDeleted: false,
        OR: [
          ...keywords.map((kw) => ({ content: { contains: kw } })),
          ...keywords.map((kw) => ({ title: { contains: kw } })),
        ],
      },
      include: {
        document: {
          select: {
            title: true,
          },
        },
      },
      take: topK * 2,
    });

    const results = chunks.map((chunk) => {
      let score = 0;
      const text = `${chunk.title || ''} ${chunk.content}`;

      keywords.forEach((kw) => {
        const regex = new RegExp(kw, 'gi');
        const matches = text.match(regex);
        if (matches) {
          const weight = kw.length * 5;
          score += matches.length * weight;
        }
      });

      return {
        id: String(chunk.id),
        title: chunk.title || chunk.document?.title || '',
        content: chunk.content,
        documentId: String(chunk.documentId),
        score,
      };
    });

    return results
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  } catch (error) {
    console.error('RAG search error:', error);
    return [];
  }
};

const MAX_CONTEXT_LENGTH = 2000;

export const buildContext = async (query: string): Promise<string> => {
  try {
    const results = await searchKnowledge(query);

    if (results.length === 0) {
      console.log('RAG: No relevant knowledge found for query:', query);
      return '';
    }

    let context = results
      .map((r) => `【${r.title}】\n${r.content}`)
      .join('\n\n');

    if (context.length > MAX_CONTEXT_LENGTH) {
      console.log(
        'RAG: Context length exceeded, truncating from',
        context.length,
        'to',
        MAX_CONTEXT_LENGTH
      );
      context = context.slice(0, MAX_CONTEXT_LENGTH - 3) + '...';
    }

    console.log(
      'RAG: Found',
      results.length,
      'relevant documents, context length:',
      context.length
    );
    return context;
  } catch (error) {
    console.error('RAG buildContext error:', error);
    return '';
  }
};
