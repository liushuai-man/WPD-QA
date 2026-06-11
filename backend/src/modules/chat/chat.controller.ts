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
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const result = await createConversation(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetConversationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getConversationById(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetUserConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const result = await getUserConversations(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleCreateMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, role, content } = req.body;
    const result = await createMessage(conversationId, role, content);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleDeleteConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteConversation(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};