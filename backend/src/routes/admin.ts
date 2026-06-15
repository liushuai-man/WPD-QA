import { Router, type Router as RouterType } from 'express';
import { adminAuthMiddleware, handleAdminLogin } from '../middlewares/adminAuth';
import {
  handleGetUsers,
  handleDeleteUser,
  handleGetKnowledgeList,
  handleCreateKnowledge,
  handleDeleteKnowledge,
  handleGetQuestions,
  handleCreateQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  handleGetConversations,
  handleDeleteConversation,
  handleGetStatistics,
} from '../modules/admin/admin.controller';

const router: RouterType = Router();

// Admin login (no auth required)
router.post('/login', handleAdminLogin);

// Protected admin routes (require auth)
router.get('/statistics', adminAuthMiddleware, handleGetStatistics);

// User management
router.get('/users', adminAuthMiddleware, handleGetUsers);
router.delete('/users/:id', adminAuthMiddleware, handleDeleteUser);

// Knowledge management
router.get('/knowledge', adminAuthMiddleware, handleGetKnowledgeList);
router.post('/knowledge', adminAuthMiddleware, handleCreateKnowledge);
router.delete('/knowledge/:id', adminAuthMiddleware, handleDeleteKnowledge);

// Question management
router.get('/questions', adminAuthMiddleware, handleGetQuestions);
router.post('/questions', adminAuthMiddleware, handleCreateQuestion);
router.put('/questions/:id', adminAuthMiddleware, handleUpdateQuestion);
router.delete('/questions/:id', adminAuthMiddleware, handleDeleteQuestion);

// Conversation management
router.get('/conversations', adminAuthMiddleware, handleGetConversations);
router.delete('/conversations/:id', adminAuthMiddleware, handleDeleteConversation);

export default router;
