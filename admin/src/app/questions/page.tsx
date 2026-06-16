'use client';

import { useState, useEffect } from 'react';
import { questionApi } from '@/services';
import { Layout } from '@/components/layout';
import {
  Search,
  Trash2,
  Plus,
  Edit2,
  HelpCircle,
  Calendar,
  Star,
} from 'lucide-react';
import type { Question, Pagination } from '@/types';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Pagination<Question> | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    options: [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' },
    ],
    answer: '',
    analysis: '',
    difficulty: 1,
    categoryId: null as number | null,
  });

  const fetchQuestions = async (page: number = 1, kw?: string) => {
    setLoading(true);
    try {
      const response = await questionApi.getQuestions(page, 10, kw);
      if (response.code === 200) {
        setQuestions(response.data);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('获取题目列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1, keyword);
  }, [keyword]);

  const handleSearch = () => {
    fetchQuestions(1, keyword);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await questionApi.deleteQuestion(id);
      if (response.code === 200) {
        fetchQuestions(currentPage, keyword);
        setShowConfirm(null);
      }
    } catch (err) {
      console.error('删除题目失败:', err);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await questionApi.createQuestion(formData);
      if (response.code === 201) {
        fetchQuestions(1, keyword);
        setShowModal(null);
        resetForm();
      }
    } catch (err) {
      console.error('创建题目失败:', err);
    }
  };

  const handleUpdate = async () => {
    if (!editingQuestion) return;

    try {
      const response = await questionApi.updateQuestion(
        editingQuestion.id,
        formData
      );
      if (response.code === 200) {
        fetchQuestions(currentPage, keyword);
        setShowModal(null);
        setEditingQuestion(null);
        resetForm();
      }
    } catch (err) {
      console.error('更新题目失败:', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || (questions && page > Math.ceil(questions.total / 10)))
      return;
    fetchQuestions(page, keyword);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal('create');
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      options: question.options,
      answer: question.answer,
      analysis: question.analysis || '',
      difficulty: question.difficulty,
      categoryId: question.categoryId,
    });
    setShowModal('edit');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      options: [
        { label: 'A', content: '' },
        { label: 'B', content: '' },
        { label: 'C', content: '' },
        { label: 'D', content: '' },
      ],
      answer: '',
      analysis: '',
      difficulty: 1,
      categoryId: null,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ['', '简单', '中等', '困难'];
    return labels[level] || '未知';
  };

  const getDifficultyColor = (level: number) => {
    const colors = [
      '',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-red-100 text-red-700',
    ];
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">题库管理</h1>
            <p className="text-text-muted mt-1">管理平台所有题目</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增题目
          </button>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索题目内容"
                className="pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                搜索
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    题目
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    难度
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    分类
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    答案
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    创建时间
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-text-muted"
                    >
                      加载中...
                    </td>
                  </tr>
                ) : questions?.list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-text-muted"
                    >
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  questions?.list.map((question) => (
                    <tr
                      key={question.id}
                      className="border-b border-border hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-text">
                        {question.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 max-w-md">
                          <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-text truncate">
                            {question.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}
                        >
                          {getDifficultyLabel(question.difficulty)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        {question.categoryName || '未分类'}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-success">
                        {question.answer}
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(question.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(question)}
                            className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowConfirm(question.id)}
                            className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {questions && questions.total > 10 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-muted">
                共 {questions.total} 条记录，当前第 {currentPage} 页
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                {Array.from(
                  { length: Math.ceil(questions.total / 10) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'border border-border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(questions.total / 10)}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-text mb-4">
                {showModal === 'create' ? '新增题目' : '编辑题目'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    题目内容
                  </label>
                  <textarea
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="请输入题目内容"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    选项
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div
                        key={option.label}
                        className="flex items-center gap-3"
                      >
                        <span className="w-8 h-8 bg-primary/10 text-primary font-semibold rounded-lg flex items-center justify-center">
                          {option.label}
                        </span>
                        <input
                          type="text"
                          value={option.content}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = {
                              ...newOptions[index],
                              content: e.target.value,
                            };
                            setFormData({ ...formData, options: newOptions });
                          }}
                          placeholder={`请输入选项${option.label}的内容`}
                          className="flex-1 px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    正确答案
                  </label>
                  <select
                    value={formData.answer}
                    onChange={(e) =>
                      setFormData({ ...formData, answer: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">请选择正确答案</option>
                    {formData.options.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    难度
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setFormData({ ...formData, difficulty: level })
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          formData.difficulty === level
                            ? 'bg-primary text-white'
                            : 'border border-border hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Star
                            className={`w-4 h-4 ${level <= formData.difficulty ? 'fill-current' : ''}`}
                          />
                          {getDifficultyLabel(level)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    答案解析
                  </label>
                  <textarea
                    value={formData.analysis}
                    onChange={(e) =>
                      setFormData({ ...formData, analysis: e.target.value })
                    }
                    placeholder="请输入答案解析（可选）"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(null);
                    setEditingQuestion(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={showModal === 'create' ? handleCreate : handleUpdate}
                  disabled={
                    !formData.title ||
                    !formData.answer ||
                    formData.options.some((o) => !o.content)
                  }
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showModal === 'create' ? '创建' : '更新'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-text mb-2">确认删除</h3>
              <p className="text-text-muted mb-6">
                确定要删除该题目吗？此操作无法撤销。
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(showConfirm)}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
