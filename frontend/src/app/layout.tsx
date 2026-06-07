import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WPD-QA - 小麦病虫害智能问答',
  description: '小麦病虫害智能问答与学习平台',
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
