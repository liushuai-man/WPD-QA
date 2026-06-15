'use client';

import { useState, useEffect } from 'react';
import { statisticsApi } from '@/services';
import { Layout } from '@/components/layout';
import {
  Users,
  MessageSquare,
  HelpCircle,
  BookOpen,
  TrendingUp,
  Activity,
} from 'lucide-react';
import type { Statistics } from '@/types';

const statCards = [
  { id: 'users', label: '用户总数', icon: Users, color: 'bg-blue-500' },
  { id: 'active', label: '今日活跃', icon: Activity, color: 'bg-green-500' },
  { id: 'chats', label: '会话总数', icon: MessageSquare, color: 'bg-purple-500' },
  { id: 'todayChats', label: '今日会话', icon: TrendingUp, color: 'bg-orange-500' },
  { id: 'quiz', label: '答题总数', icon: HelpCircle, color: 'bg-pink-500' },
  { id: 'knowledge', label: '知识库文档', icon: BookOpen, color: 'bg-cyan-500' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statisticsApi.getStatistics();
        if (response.code === 200) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('获取统计数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatValue = (id: string) => {
    if (!stats) return '--';
    switch (id) {
      case 'users': return stats.totalUsers.toLocaleString();
      case 'active': return stats.todayActiveUsers.toLocaleString();
      case 'chats': return stats.totalChats.toLocaleString();
      case 'todayChats': return stats.todayChats.toLocaleString();
      case 'quiz': return stats.totalQuiz.toLocaleString();
      case 'knowledge': return stats.knowledgeCount.toLocaleString();
      default: return '--';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">仪表盘</h1>
            <p className="text-text-muted mt-1">欢迎回来，查看平台数据概览</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-surface rounded-xl p-5 border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                    <p className="text-2xl font-bold text-text mt-2">{getStatValue(stat.id)}</p>
                  </div>
                  <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-text mb-4">实时数据</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text-muted">题库数量</span>
                <span className="font-semibold text-text">{stats?.questionCount || '--'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text-muted">今日答题</span>
                <span className="font-semibold text-text">{stats?.todayQuiz || '--'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text-muted">RAG命中率</span>
                <span className="font-semibold text-text">{stats?.ragHitRate || '--'}%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-text mb-4">系统状态</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">API服务</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  <span className="text-success text-sm">运行中</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">数据库</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  <span className="text-success text-sm">已连接</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">AI服务</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  <span className="text-success text-sm">可用</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
