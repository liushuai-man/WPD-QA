'use client';

import { useState, useEffect } from 'react';
import { conversationApi } from '@/services';
import { Layout } from '@/components/layout';
import {
  Search,
  Trash2,
  MessageSquare,
  Calendar,
  Clock,
  Mail,
} from 'lucide-react';
import type { Conversation, Pagination } from '@/types';

export default function ConversationsPage() {
  const [conversations, setConversations] =
    useState<Pagination<Conversation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  const fetchConversations = async (page: number = 1, kw?: string) => {
    setLoading(true);
    try {
      const response = await conversationApi.getConversations(page, 10);
      if (response.code === 200) {
        setConversations(response.data);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('获取会话列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(1);
  }, []);

  const handleSearch = () => {
    fetchConversations(1);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await conversationApi.deleteConversation(id);
      if (response.code === 200) {
        fetchConversations(currentPage);
        setShowConfirm(null);
      }
    } catch (err) {
      console.error('删除会话失败:', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      (conversations && page > Math.ceil(conversations.total / 10))
    )
      return;
    fetchConversations(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">会话管理</h1>
            <p className="text-text-muted mt-1">管理用户对话会话</p>
          </div>
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
                placeholder="搜索会话标题"
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
                    会话标题
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    用户邮箱
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    消息数
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    创建时间
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    更新时间
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
                ) : conversations?.list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-text-muted"
                    >
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  conversations?.list.map((conv) => (
                    <tr
                      key={conv.id}
                      className="border-b border-border hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-text">
                        {conv.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          <span className="text-text font-medium max-w-md truncate">
                            {conv.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {conv.userEmail}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text">
                        {conv.messageCount}
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(conv.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatTime(conv.updatedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setShowConfirm(conv.id)}
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

          {conversations && conversations.total > 10 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-muted">
                共 {conversations.total} 条记录，当前第 {currentPage} 页
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
                  { length: Math.ceil(conversations.total / 10) },
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
                  disabled={currentPage === Math.ceil(conversations.total / 10)}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-text mb-2">确认删除</h3>
              <p className="text-text-muted mb-6">
                确定要删除该会话吗？此操作无法撤销。
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
