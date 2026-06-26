import { Request, Response } from 'express';
import {
  createConversation,
  getConversationById,
  getUserConversations,
  createMessage,
  deleteConversation,
} from './chat.service';
import {
  chatWithAgent,
  generateConversationTitle,
  type AgentResponse,
} from '../../ai/agent';
import type { ChatMessage } from '../../ai/client';

export const handleCreateConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const result = await createConversation(req.user.id);
    res.json({ code: 200, data: result, message: '创建成功' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const handleGetConversationById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await getConversationById(id);
    res.json({ code: 200, data: result, message: '查询成功' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const handleGetUserConversations = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getUserConversations(req.user.id, page, limit);
    res.json({ code: 200, data: result, message: '查询成功' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const handleCreateMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, role, content } = req.body;
    const result = await createMessage(conversationId, role, content);
    res.json({ code: 200, data: result, message: '发送成功' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const handleSendMessage = async (req: Request, res: Response) => {
  try {
    const { content, conversationId } = req.body;
    const userId = req.user?.id;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ code: 400, message: '内容不能为空' });
    }

    let history: ChatMessage[] = [];
    let convId = conversationId;

    if (convId) {
      const conversation = await getConversationById(convId);
      const messages = conversation.conversation?.messages || [];
      history = messages.slice(-10).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));
    }

    let agentResponse: AgentResponse;
    try {
      agentResponse = await chatWithAgent(content, history);
    } catch (aiError) {
      console.warn('AI API failed, using fallback response:', aiError);
      agentResponse = {
        content: `您问的是"${content}"。我是小麦病虫害智能助手，主要专注于小麦病虫害相关的问题解答。如果您有关于小麦种植、病虫害识别与防治等方面的问题，欢迎随时提问！`,
        promptTokens: 0,
        completionTokens: 0,
      };
    }

    if (userId && !convId) {
      const title = await generateConversationTitle(content);
      const newConversation = await createConversation(userId, title);
      convId = newConversation.conversation?.id || '';
    }

    let savedMessage: any = null;
    if (convId && userId) {
      await createMessage(
        convId,
        'user',
        content,
        agentResponse.promptTokens,
        0
      );
      savedMessage = await createMessage(
        convId,
        'assistant',
        agentResponse.content,
        agentResponse.promptTokens,
        agentResponse.completionTokens
      );
    }

    res.json({
      code: 200,
      data: {
        conversationId: convId,
        message: {
          id: savedMessage?.message?.id || Date.now().toString(),
          conversationId: convId,
          content: agentResponse.content,
          role: 'assistant',
          createdAt: new Date().toISOString(),
        },
      },
      message: 'success',
    });
  } catch (error) {
    console.error('Chat error:', error);
    res
      .status(500)
      .json({
        code: 500,
        message: (error as Error).message || '聊天服务异常，请稍后重试',
      });
  }
};

export const handleDeleteConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteConversation(id);
    res.json({ code: 200, data: result, message: '删除成功' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};
