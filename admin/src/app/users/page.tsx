'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/services';
import { Layout } from '@/components/layout';
import { Search, Trash2, User, Mail, Calendar } from 'lucide-react';
import type { User as UserType, Pagination } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<Pagination<UserType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  const fetchUsers = async (page: number = 1, kw?: string) => {
    setLoading(true);
    try {
      const response = await userApi.getUsers(page, 10, kw);
      if (response.code === 200) {
        setUsers(response.data);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('获取用户列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, keyword);
  }, [keyword]);

  const handleSearch = () => {
    fetchUsers(1, keyword);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await userApi.deleteUser(id);
      if (response.code === 200) {
        fetchUsers(currentPage, keyword);
        setShowConfirm(null);
      }
    } catch (err) {
      console.error('删除用户失败:', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || (users && page > Math.ceil(users.total / 10))) return;
    fetchUsers(page, keyword);
  };

  const toggleSelectAll = () => {
    if (users) {
      if (selectedIds.length === users.list.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(users.list.map((u) => u.id));
      }
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">用户管理</h1>
            <p className="text-text-muted mt-1">管理平台所有用户</p>
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
                placeholder="搜索用户（邮箱/昵称）"
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
                    <input
                      type="checkbox"
                      checked={
                        users !== null &&
                        selectedIds.length === users.list.length &&
                        users.list.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary/20"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    用户信息
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    邮箱
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    会话数
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    答题数
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                    注册时间
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
                      colSpan={8}
                      className="py-12 text-center text-text-muted"
                    >
                      加载中...
                    </td>
                  </tr>
                ) : users?.list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-text-muted"
                    >
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  users?.list.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="rounded border-border text-primary focus:ring-primary/20"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-text">
                        {user.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-text">
                              {user.nickname || '未设置'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text">
                        {user.chatCount}
                      </td>
                      <td className="py-4 px-4 text-sm text-text">
                        {user.quizCount}
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setShowConfirm(user.id)}
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

          {users && users.total > 10 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-muted">
                共 {users.total} 条记录，当前第 {currentPage} 页
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
                  { length: Math.ceil(users.total / 10) },
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
                  disabled={currentPage === Math.ceil(users.total / 10)}
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
                确定要删除该用户吗？此操作无法撤销。
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
