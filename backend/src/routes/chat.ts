import { Router, type Router as RouterType } from 'express';
import {
  handleCreateConversation,
  handleGetUserConversations,
  handleGetConversationById,
  handleSendMessage,
  handleDeleteConversation,
} from '../modules/chat';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares';

const router: RouterType = Router();

router.post('/', optionalAuthMiddleware, handleSendMessage);
router.post('/conversations', authMiddleware, handleCreateConversation);
router.get('/conversations', authMiddleware, handleGetUserConversations);
router.get('/conversations/:id', authMiddleware, handleGetConversationById);
router.delete('/conversations/:id', authMiddleware, handleDeleteConversation);

export default router;