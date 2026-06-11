import { Router, type Router as RouterType } from 'express';
import {
  handleSendRegisterCode,
  handleRegister,
  handleSendLoginCode,
  handleLoginWithCode,
  handleLoginWithPassword,
  handleSendResetCode,
  handleResetPassword,
  handleGetProfile,
} from '../modules/auth';
import { authMiddleware } from '../middlewares';

const router: RouterType = Router();

router.post('/send-register-code', handleSendRegisterCode);
router.post('/register', handleRegister);
router.post('/send-login-code', handleSendLoginCode);
router.post('/login', handleLoginWithCode);
router.post('/login-password', handleLoginWithPassword);
router.post('/send-reset-code', handleSendResetCode);
router.post('/reset-password', handleResetPassword);
router.get('/profile', authMiddleware, handleGetProfile);

export default router;