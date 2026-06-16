'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavPaths = ['/login', '/register', '/forgot-password'];
  const showNav = !hideNavPaths.includes(pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
}
