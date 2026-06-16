import { Request, Response } from 'express';
import {
  createConversation,
  getConversationById,
  getUserConversations,
  createMessage,
  deleteConversation,
} from './chat.service';

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

export const handleGetConversationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getConversationById(id);
    res.json({ code: 200, data: result, message: '查询成功' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const handleGetUserConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const result = await getUserConversations(req.user.id);
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
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ code: 400, message: '内容不能为空' });
    }

    let responseContent = '';
    const keywords = ['小麦', '病虫害', '发黄', '病害', '虫害', '防治'];
    
    if (keywords.some((kw) => content.includes(kw))) {
      responseContent = `您问的是关于"${content}"的问题。小麦病虫害防治需要综合考虑多种因素，包括品种选择、田间管理、病虫害监测和及时防治等方面。建议您：\n\n1. 及时识别病虫害类型\n2. 选择合适的防治方法\n3. 注意用药安全\n\n如需更详细的解答，请提供更多信息。`;
    } else {
      responseContent = `您问的是"${content}"。我是小麦病虫害智能助手，主要专注于小麦病虫害相关的问题解答。如果您有关于小麦种植、病虫害识别与防治等方面的问题，欢迎随时提问！`;
    }

    res.json({
      code: 200,
      data: {
        conversationId: '',
        message: {
          id: Date.now().toString(),
          conversationId: '',
          content: responseContent,
          role: 'assistant',
          createdAt: new Date().toISOString(),
        },
      },
      message: 'success',
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
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
