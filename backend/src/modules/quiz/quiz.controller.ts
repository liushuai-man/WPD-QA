import { Request, Response } from 'express';
import {
  createQuestion,
  getQuestionById,
  getAllQuestions,
  createQuizRecord,
  getUserQuizRecords,
  getQuestions as getQuestionsService,
  submitAnswer as submitAnswerService,
  getWrongQuestions as getWrongQuestionsService,
  getQuizStatistics as getQuizStatisticsService,
  removeFromWrongBook as removeFromWrongBookService,
} from './quiz.service';

export const handleCreateQuiz = async (req: Request, res: Response) => {
  try {
    const { title, options, answer, analysis, difficulty, categoryId } =
      req.body;
    const result = await createQuestion(
      title,
      options,
      answer,
      analysis,
      difficulty,
      categoryId
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getQuestionById(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetAllQuizzes = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const result = await getAllQuestions(categoryId as string);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleCreateQuizRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const { questionId, userAnswer } = req.body;
    const result = await createQuizRecord(req.user.id, questionId, userAnswer);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetUserQuizRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未授权' });
    }
    const result = await getUserQuizRecords(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getQuestionsService(page, limit);
    res.json({ code: 200, data: result, message: 'success' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const { questionId, answer } = req.body;
    const result = await submitAnswerService(
      BigInt(req.user.id),
      questionId,
      answer
    );
    res.json({ code: 200, data: result, message: 'success' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const getWrongQuestions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await getWrongQuestionsService(
      BigInt(req.user.id),
      page,
      limit
    );
    res.json({ code: 200, data: result, message: 'success' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const getQuizStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const result = await getQuizStatisticsService(BigInt(req.user.id));
    res.json({ code: 200, data: result, message: 'success' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};

export const removeFromWrongBook = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    const questionId = parseInt(req.params.questionId);
    await removeFromWrongBookService(BigInt(req.user.id), questionId);
    res.json({ code: 200, message: 'success' });
  } catch (error) {
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};
