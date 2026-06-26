import prisma from '../lib/prisma';
import { searchKnowledge } from '../ai/rag';

const testRag = async () => {
  console.log('=== RAG 检索测试 ===\n');
  
  const chunkCount = await prisma.knowledgeChunk.count();
  console.log(`知识库分块总数: ${chunkCount}`);
  
  const testQueries = ['小麦条锈病', '小麦白粉病', '小麦叶子发黄', '小麦蚜虫', '小麦赤霉病'];
  
  for (const query of testQueries) {
    const results = await searchKnowledge(query, 3);
    console.log(`\n查询: "${query}"`);
    console.log(`找到 ${results.length} 条相关结果:`);
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.title.slice(0, 40)} - 匹配度: ${r.score}`);
    });
  }
  
  await prisma.$disconnect();
};

testRag().catch((error) => {
  console.error('测试失败:', error);
  process.exit(1);
});