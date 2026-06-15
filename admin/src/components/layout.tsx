'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/store';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Settings,
  LogOut,
  Wheat,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'users', label: '用户管理', icon: Users, path: '/users' },
  { id: 'knowledge', label: '知识库', icon: BookOpen, path: '/knowledge' },
  { id: 'questions', label: '题库管理', icon: HelpCircle, path: '/questions' },
  { id: 'conversations', label: '会话管理', icon: MessageSquare, path: '/conversations' },
  { id: 'settings', label: '系统设置', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, admin } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Wheat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text">WPD-QA</h1>
            <p className="text-xs text-text-muted">管理后台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-muted hover:bg-gray-100 hover:text-text'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-gray-100 hover:text-danger transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </div>
    </aside>
  );
}

export function Header() {
  const { admin } = useAdminAuthStore();
  
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-text">管理后台</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold">{admin?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text">{admin?.username}</p>
            <p className="text-xs text-text-muted">管理员</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
