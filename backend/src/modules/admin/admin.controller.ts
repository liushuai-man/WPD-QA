import { Request, Response } from 'express';
import {
  adminAuthMiddleware,
  handleAdminLogin,
} from '../../middlewares/adminAuth';
import {
  getUsers,
  deleteUser,
  getKnowledgeList,
  createKnowledge,
  deleteKnowledge,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getConversations,
  deleteConversation,
  getStatistics,
  updateAdminPassword,
} from './admin.service';

// Re-export login handler from adminAuth
export { handleAdminLogin };

// ==================== 用户管理 ====================

export const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const keyword = req.query.keyword as string | undefined;

    const result = await getUsers(page, limit, keyword);
    res.json({ code: 200, message: 'success', data: result });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ code: 500, message: '获取用户列表失败' });
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ code: 400, message: '无效的用户ID' });
    }

    await deleteUser(id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ code: 500, message: '删除用户失败' });
  }
};

// ==================== 知识库管理 ====================

export const handleGetKnowledgeList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const keyword = req.query.keyword as string | undefined;

    const result = await getKnowledgeList(page, limit, keyword);
    res.json({ code: 200, message: 'success', data: result });
  } catch (error) {
    console.error('Get knowledge list error:', error);
    res.status(500).json({ code: 500, message: '获取知识库列表失败' });
  }
};

export const handleCreateKnowledge = async (req: Request, res: Response) => {
  try {
    const { title, source, content, categoryId } = req.body;

    if (!title) {
      return res.status(400).json({ code: 400, message: '标题不能为空' });
    }

    const result = await createKnowledge({
      title,
      source,
      content,
      categoryId,
    });
    res.json({ code: 200, message: '创建成功', data: result });
  } catch (error) {
    console.error('Create knowledge error:', error);
    res.status(500).json({ code: 500, message: '创建知识库失败' });
  }
};

export const handleDeleteKnowledge = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ code: 400, message: '无效的知识库ID' });
    }

    await deleteKnowledge(id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error('Delete knowledge error:', error);
    res.status(500).json({ code: 500, message: '删除知识库失败' });
  }
};

// ==================== 题库管理 ====================

export const handleGetQuestions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const keyword = req.query.keyword as string | undefined;

    const result = await getQuestions(page, limit, keyword);
    res.json({ code: 200, message: 'success', data: result });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ code: 500, message: '获取题目列表失败' });
  }
};

export const handleCreateQuestion = async (req: Request, res: Response) => {
  try {
    const { title, options, answer, analysis, difficulty, categoryId } =
      req.body;

    if (!title || !options || !answer) {
      return res
        .status(400)
        .json({ code: 400, message: '题目、选项和答案不能为空' });
    }

    const result = await createQuestion({
      title,
      options,
      answer,
      analysis,
      difficulty,
      categoryId,
    });
    res.json({ code: 200, message: '创建成功', data: result });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ code: 500, message: '创建题目失败' });
  }
};

export const handleUpdateQuestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ code: 400, message: '无效的题目ID' });
    }

    const { title, options, answer, analysis, difficulty, categoryId } =
      req.body;
    const result = await updateQuestion(id, {
      title,
      options,
      answer,
      analysis,
      difficulty,
      categoryId,
    });
    res.json({ code: 200, message: '更新成功', data: result });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ code: 500, message: '更新题目失败' });
  }
};

export const handleDeleteQuestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ code: 400, message: '无效的题目ID' });
    }

    await deleteQuestion(id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ code: 500, message: '删除题目失败' });
  }
};

// ==================== 会话管理 ====================

export const handleGetConversations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getConversations(page, limit);
    res.json({ code: 200, message: 'success', data: result });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ code: 500, message: '获取会话列表失败' });
  }
};

export const handleDeleteConversation = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ code: 400, message: '无效的会话ID' });
    }

    await deleteConversation(id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ code: 500, message: '删除会话失败' });
  }
};

// ==================== 统计 ====================

export const handleGetStatistics = async (_req: Request, res: Response) => {
  try {
    const result = await getStatistics();
    res.json({ code: 200, message: 'success', data: result });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ code: 500, message: '获取统计数据失败' });
  }
};

// ==================== 管理员账户管理 ====================

export const handleUpdateAdminPassword = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ code: 400, message: '当前密码和新密码不能为空' });
    }

    await updateAdminPassword(parseInt(req.admin.id), currentPassword, newPassword);
    res.json({ code: 200, message: '密码修改成功' });
  } catch (error) {
    console.error('Update admin password error:', error);
    res.status(400).json({ code: 400, message: (error as Error).message });
  }
};
