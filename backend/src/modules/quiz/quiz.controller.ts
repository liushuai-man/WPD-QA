import { Request, Response } from 'express';
import {
  createQuestion,
  getQuestionById,
  getAllQuestions,
  createQuizRecord,
  getUserQuizRecords,
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
