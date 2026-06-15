'use client';

import { usePathname } from 'next/navigation';
import { Home, MessageCircle, BookOpen, User } from 'lucide-react';

const navItems = [
  { id: 'home', label: '首页', icon: Home, path: '/' },
  { id: 'chat', label: '问答', icon: MessageCircle, path: '/chat' },
  { id: 'knowledge', label: '学习', icon: BookOpen, path: '/knowledge' },
  { id: 'profile', label: '我的', icon: User, path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => {
                window.location.href = item.path;
              }}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-green-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
