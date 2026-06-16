import { Router } from 'express';

import {
  getQuestions,
  submitAnswer,
  getWrongQuestions,
  getQuizStatistics,
  removeFromWrongBook,
} from '../modules/quiz/quiz.controller';
import { authMiddleware } from '../middlewares';

const router: Router = Router();

router.get('/questions', authMiddleware, getQuestions);
router.post('/answer', authMiddleware, submitAnswer);
router.get('/wrong', authMiddleware, getWrongQuestions);
router.delete('/wrong/:questionId', authMiddleware, removeFromWrongBook);
router.get('/statistics', authMiddleware, getQuizStatistics);

export default router;
