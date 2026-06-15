'use client';

import { useState, useEffect } from 'react';
import { knowledgeApi } from '@/services';
import { Layout } from '@/components/layout';
import {
  Search,
  Trash2,
  Upload,
  BookOpen,
  Calendar,
  FolderOpen,
} from 'lucide-react';
import type { Knowledge, Pagination } from '@/types';

export default function KnowledgePage() {
  const [knowledgeList, setKnowledgeList] =
    useState<Pagination<Knowledge> | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSource, setUploadSource] = useState('');

  const fetchKnowledge = async (page: number = 1, kw?: string) => {
    setLoading(true);
    try {
      const response = await knowledgeApi.getKnowledgeList(page, 10, kw);
      if (response.code === 200) {
        setKnowledgeList(response.data);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('获取知识库列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge(1, keyword);
  }, [keyword]);

  const handleSearch = () => {
    fetchKnowledge(1, keyword);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await knowledgeApi.deleteKnowledge(id);
      if (response.code === 200) {
        fetchKnowledge(currentPage, keyword);
        setShowConfirm(null);
      }
    } catch (err) {
      console.error('删除知识库文档失败:', err);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (uploadTitle) formData.append('title', uploadTitle);
    if (uploadSource) formData.append('source', uploadSource);

    try {
      const response = await knowledgeApi.uploadKnowledge(formData);
      if (response.code === 200) {
        fetchKnowledge(1, keyword);
        setShowUpload(false);
        setUploadFile(null);
        setUploadTitle('');
        setUploadSource('');
      }
    } catch (err) {
      console.error('上传文档失败:', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      (knowledgeList && page > Math.ceil(knowledgeList.total / 10))
    )
      return;
    fetchKnowledge(page, keyword);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">知识库管理</h1>
            <p className="text-text-muted mt-1">管理平台知识库文档</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Upload className="w-4 h-4" />
            上传文档
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
                placeholder="搜索文档标题"
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
                    标题
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    分类
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    来源
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
                      colSpan={6}
                      className="py-12 text-center text-text-muted"
                    >
                      加载中...
                    </td>
                  </tr>
                ) : knowledgeList?.list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-text-muted"
                    >
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  knowledgeList?.list.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-text">
                        {item.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-text font-medium">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" />
                          {item.categoryName}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text">
                        {item.source || '未设置'}
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setShowConfirm(item.id)}
                          className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {knowledgeList && knowledgeList.total > 10 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-muted">
                共 {knowledgeList.total} 条记录，当前第 {currentPage} 页
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
                  { length: Math.ceil(knowledgeList.total / 10) },
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
                  disabled={currentPage === Math.ceil(knowledgeList.total / 10)}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>

        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-xl p-6 max-w-lg w-full mx-4">
              <h3 className="text-lg font-semibold text-text mb-4">
                上传知识库文档
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    文档文件
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    文档标题
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="默认使用文件名"
                    className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    来源出处
                  </label>
                  <input
                    type="text"
                    value={uploadSource}
                    onChange={(e) => setUploadSource(e.target.value)}
                    placeholder="如：农业农村部"
                    className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上传
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
                确定要删除该文档吗？此操作无法撤销。
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
