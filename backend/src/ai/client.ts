import axios from 'axios';

const aiApiKey = process.env.AI_API_KEY || '';
const aiApiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.openai.com/v1';

const aiClient = axios.create({
  baseURL: aiApiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${aiApiKey}`,
  },
  timeout: 60000,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const defaultModel = process.env.AI_MODEL || 'mimo-v2.5-pro';

export const chatCompletion = async (
  messages: ChatMessage[],
  model: string = defaultModel
): Promise<ChatCompletionResponse> => {
  try {
    console.log('AI Client: Sending request to model:', model);
    console.log('AI Client: Messages count:', messages.length);
    
    const response = await aiClient.post('/chat/completions', {
      model,
      messages,
      temperature: 0.7,
      max_completion_tokens: 2048,
      stream: false,
    });
    
    console.log('AI Client: Response received, status:', response.status);
    return response.data;
  } catch (error: any) {
    console.error('AI API error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('AI API error details:', JSON.stringify(error.response.data));
    }
    throw new Error(error.response?.data?.message || 'AI服务调用失败');
  }
};

export default aiClient;
