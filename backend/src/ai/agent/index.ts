import { chatCompletion, type ChatMessage } from '../client';
import { SYSTEM_PROMPT, formatRagPrompt } from '../prompts';
import { buildContext } from '../rag';

export interface AgentResponse {
  content: string;
  promptTokens: number;
  completionTokens: number;
}

export const chatWithAgent = async (
  userMessage: string,
  history?: ChatMessage[]
): Promise<AgentResponse> => {
  const ragContext = await buildContext(userMessage);

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
  ];

  if (ragContext) {
    messages.push({
      role: 'system',
      content: formatRagPrompt(ragContext),
    });
  }

  if (history && history.length > 0) {
    messages.push(...history);
  }

  messages.push({
    role: 'user',
    content: userMessage,
  });

  console.log(
    'Agent: Calling AI API with',
    messages.length,
    'messages, user message:',
    userMessage.slice(0, 50) + '...'
  );

  try {
    const response = await chatCompletion(messages);

    if (response.choices && response.choices.length > 0) {
      console.log(
        'Agent: AI API response received, completion tokens:',
        response.usage?.completion_tokens
      );
      return {
        content: response.choices[0].message.content,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
      };
    }

    throw new Error('No response from AI');
  } catch (error) {
    console.error('Agent error:', error);
    throw new Error('AI服务调用失败，请稍后重试');
  }
};

export const generateConversationTitle = async (
  firstMessage: string
): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '请根据用户的问题生成一个简短的会话标题，不超过20个字符。',
    },
    {
      role: 'user',
      content: `用户问题：${firstMessage}\n请生成会话标题：`,
    },
  ];

  try {
    const response = await chatCompletion(messages);
    const title = response.choices?.[0]?.message?.content || '未命名会话';
    return title.trim().slice(0, 50);
  } catch {
    return firstMessage.slice(0, 20) + '...';
  }
};
