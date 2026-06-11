import type { Metadata } from 'next';
import { MantineProvider } from '@mantine/core';
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
      <body>
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            primaryColor: 'blue',
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
