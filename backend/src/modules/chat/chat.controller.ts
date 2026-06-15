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
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const { message, userId } = req.body;

    let responseContent = '抱歉，我无法回答这个问题。';
    const keywords = ['小麦', '病虫害', '发黄', '病害', '虫害', '防治'];
    if (keywords.some((kw) => message.includes(kw))) {
      responseContent = `您问的是关于"${message}"的问题。小麦病虫害防治需要综合考虑多种因素，包括品种选择、田间管理、病虫害监测和及时防治等方面。建议您：\n\n1. 及时识别病虫害类型\n2. 选择合适的防治方法\n3. 注意用药安全\n\n如需更详细的解答，请提供更多信息。`;
    }

    res.json({
      code: 200,
      data: {
        response: responseContent,
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
