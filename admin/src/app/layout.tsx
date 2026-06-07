import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WPD-QA 管理后台',
  description: '小麦病虫害智能问答系统管理后台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
