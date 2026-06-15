import { Router, type Router as RouterType } from 'express';
import {
  handleCreateConversation,
  handleGetUserConversations,
  handleGetConversationById,
  handleSendMessage,
} from '../modules/chat';
import { authMiddleware } from '../middlewares';

const router: RouterType = Router();

router.post('/api/chat', authMiddleware, handleSendMessage);
router.post('/api/conversations', authMiddleware, handleCreateConversation);
router.get('/api/conversations', authMiddleware, handleGetUserConversations);
router.get('/api/conversations/:id', authMiddleware, handleGetConversationById);

export default router;