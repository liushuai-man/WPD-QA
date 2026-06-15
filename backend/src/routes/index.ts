import { Router, type Router as RouterType } from 'express';
import {
  handleGetUserById,
  handleUpdateUserProfile,
  handleUpdateUserPassword,
  handleDeleteUser,
  handleGetAllUsers,
} from '../modules/user';
import { authMiddleware } from '../middlewares';

const router: RouterType = Router();

router.get('/api/users/:id', authMiddleware, handleGetUserById);
router.put('/api/users/profile', authMiddleware, handleUpdateUserProfile);
router.put('/api/users/password', authMiddleware, handleUpdateUserPassword);
router.delete('/api/users/:id', authMiddleware, handleDeleteUser);
router.get('/api/users', handleGetAllUsers);

export default router;