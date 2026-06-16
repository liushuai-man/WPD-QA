import { Router } from 'express';

import {
  getQuestions,
  submitAnswer,
  getWrongQuestions,
  getQuizStatistics,
} from '../modules/quiz/quiz.controller';
import { authMiddleware } from '../middlewares';

const router: Router = Router();

router.get('/questions', authMiddleware, getQuestions);
router.post('/answer', authMiddleware, submitAnswer);
router.get('/wrong', authMiddleware, getWrongQuestions);
router.get('/statistics', authMiddleware, getQuizStatistics);

export default router;
