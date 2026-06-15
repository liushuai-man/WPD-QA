'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Settings as SettingsIcon, Database, Shield, Server, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'WPD-QA 小麦病虫害智能问答系统',
    apiTimeout: 30000,
    maxChatLength: 100,
    enableRAG: true,
    ragHitThreshold: 0.7,
    dailyChatLimit: 100,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">系统设置</h1>
            <p className="text-text-muted mt-1">配置系统参数</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Save className="w-4 h-4" />
            保存设置
          </button>
        </div>

        {saved && (
          <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            设置已保存成功
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              基本设置
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">站点名称</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">API超时时间（毫秒）</label>
                <input
                  type="number"
                  value={settings.apiTimeout}
                  onChange={(e) => setSettings({ ...settings, apiTimeout: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">每日会话限制（次）</label>
                <input
                  type="number"
                  value={settings.dailyChatLimit}
                  onChange={(e) => setSettings({ ...settings, dailyChatLimit: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              RAG设置
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text">启用RAG检索</label>
                <button
                  onClick={() => setSettings({ ...settings, enableRAG: !settings.enableRAG })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.enableRAG ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.enableRAG ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">RAG命中阈值</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.ragHitThreshold}
                  onChange={(e) => setSettings({ ...settings, ragHitThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">最大对话历史长度</label>
                <input
                  type="number"
                  value={settings.maxChatLength}
                  onChange={(e) => setSettings({ ...settings, maxChatLength: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            系统状态
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-text-muted mb-1">API服务</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span className="text-success font-medium">运行中</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-text-muted mb-1">数据库</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span className="text-success font-medium">已连接</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-text-muted mb-1">AI服务</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span className="text-success font-medium">可用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
