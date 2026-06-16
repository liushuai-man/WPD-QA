import type { Metadata } from 'next';
import { MantineProvider } from '@mantine/core';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: '麦医生 - 小麦病虫害智能问答',
  description: '小麦病虫害智能问答与学习平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            primaryColor: 'green',
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          }}
        >
          <ClientLayout>{children}</ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
