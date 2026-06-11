import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { getRedisClient, closeRedis } from './utils/redis';

// 加载环境变量
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// 中间件
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/auth', authRoutes);

// 404 处理
app.use((_req: Request, res: Response) => {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

// 错误处理
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ code: 500, message: err.message || 'Internal Server Error' });
});

// 启动服务
const startServer = async () => {
  try {
    // 初始化 Redis 连接
    console.log('🔄 Initializing Redis connection...');
    await getRedisClient();
    console.log('✅ Redis initialized successfully');

    // 启动 HTTP 服务器
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// 优雅关闭
const gracefulShutdown = async () => {
  console.log('\n🔄 Shutting down gracefully...');
  try {
    await closeRedis();
    console.log('✅ Redis connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();

export default app;
