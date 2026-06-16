import { Request, Response } from 'express';
import {
  createKnowledgeDocument,
  getKnowledgeDocumentById,
  getAllKnowledgeDocuments,
  updateKnowledgeDocument,
  deleteKnowledgeDocument,
} from './knowledge.service';

export const handleCreateKnowledge = async (req: Request, res: Response) => {
  try {
    const { title, content, source, categoryId, fileName, fileType, fileSize } =
      req.body;
    const result = await createKnowledgeDocument(
      title,
      content,
      source,
      categoryId,
      fileName,
      fileType,
      fileSize
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetKnowledgeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getKnowledgeDocumentById(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleGetAllKnowledge = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const result = await getAllKnowledgeDocuments(categoryId as string);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleUpdateKnowledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, source } = req.body;
    const result = await updateKnowledgeDocument(id, title, content, source);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleDeleteKnowledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteKnowledgeDocument(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
