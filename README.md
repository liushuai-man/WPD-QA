# WPD-QA

> Wheat Pest & Disease Question Answering System

小麦病虫害智能问答与学习平台

---

## 项目简介

WPD-QA 是一个面向农业领域的小麦病虫害智能问答与学习平台，融合 AI 智能问答、RAG 知识库检索、农业知识学习、智能答题训练等功能，帮助用户快速获取病虫害知识、防治方案及农业种植建议。

### 核心能力

| 能力模块      | 功能描述                     |
| ------------- | ---------------------------- |
| AI智能问答    | 基于大语言模型的自然语言交互 |
| RAG知识库检索 | 基于知识库的精准知识召回     |
| 农业知识学习  | 结构化的病虫害知识学习       |
| 智能答题训练  | 题库练习与错题管理           |

---

## 技术栈

| 分类     | 技术        | 版本    |
| -------- | ----------- | ------- |
| 前端框架 | Next.js     | 16.x    |
| UI组件库 | shadcn/ui   | latest  |
| CSS方案  | TailwindCSS | 3.x/4.x |
| 开发语言 | TypeScript  | 5.x     |
| 状态管理 | Zustand     | latest  |
| 后端框架 | Express     | 4.x     |
| AI框架   | Mastra      | latest  |
| ORM      | Prisma      | 5.x     |
| 数据库   | PostgreSQL  | 16.x    |
| 向量扩展 | pgvector    | latest  |
| 缓存     | Redis       | 7.x     |
| 身份认证 | JWT         | -       |
| 大模型   | DeepSeek    | -       |
| 包管理器 | pnpm        | 8.x     |

---

## 项目结构

```
WPD-QA/
├── frontend/                  # 用户端（Next.js）
│   ├── src/
│   │   ├── app/            # 页面路由
│   │   │   ├── chat/       # AI问答页
│   │   │   ├── quiz/       # 知识答题页
│   │   │   ├── profile/    # 个人中心页
│   │   │   ├── login/      # 登录页
│   │   │   └── register/    # 注册页
│   │   ├── components/     # 组件
│   │   │   ├── chat/
│   │   │   ├── quiz/
│   │   │   ├── knowledge/
│   │   │   └── ui/
│   │   ├── services/       # API服务
│   │   ├── store/          # 状态管理
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── lib/            # 工具函数
│   │   └── types/          # 类型定义
│   └── package.json
├── admin/                    # 管理后台（Next.js）
│   ├── src/
│   │   ├── app/            # 页面路由
│   │   │   ├── dashboard/   # 数据统计页
│   │   │   ├── users/      # 用户管理页
│   │   │   ├── knowledge/   # 知识库管理页
│   │   │   ├── questions/   # 题库管理页
│   │   │   ├── conversations/ # 会话管理页
│   │   │   ├── settings/    # 系统设置页
│   │   │   ├── login/       # 管理员登录页
│   │   │   └── index.tsx   # 首页/仪表盘
│   │   ├── components/      # 组件
│   │   ├── services/       # API服务
│   │   ├── store/          # 状态管理
│   │   ├── hooks/          # 自定义Hooks
│   │   └── types/          # 类型定义
│   └── package.json
├── backend/                  # 后端服务（Express）
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── user/       # 用户模块
│   │   │   ├── chat/       # 聊天模块
│   │   │   ├── knowledge/   # 知识库模块
│   │   │   ├── quiz/       # 答题模块
│   │   │   ├── admin/      # 管理模块
│   │   │   └── statistics/  # 统计模块
│   │   ├── ai/             # AI能力
│   │   │   ├── agent/      # Agent
│   │   │   ├── rag/        # RAG检索
│   │   │   ├── prompts/    # 提示词
│   │   │   └── workflows/  # 工作流
│   │   ├── middlewares/     # 中间件
│   │   ├── routes/         # 路由
│   │   ├── utils/          # 工具函数
│   │   ├── types/          # 类型定义
│   │   └── server.ts       # 服务入口
│   ├── prisma/
│   │   └── schema.prisma   # 数据库Schema
│   └── package.json
├── docs/                    # 项目文档
├── docker/                  # Docker配置
├── nginx/                   # Nginx配置
├── docker-compose.yml       # Docker Compose配置
├── pnpm-workspace.yaml      # pnpm workspace配置
└── README.md
```

---

## 快速开始

### 环境要求

- **Node.js**: 20.x+
- **pnpm**: 8.x+
- **Docker**: 24.0+
- **Docker Compose**: 2.20+

### 安装依赖

```bash
# 安装所有依赖（根目录 + 三个子项目）
pnpm install:all

# 或使用 pnpm workspace 自动安装
pnpm install
```

### 配置环境变量

复制 `.env.example` 并修改配置：

```bash
cp backend/.env.example backend/.env
```

编辑 `backend/.env` 文件：

```env
# 数据库配置
DATABASE_URL=postgresql://postgres:password@localhost:5432/wpd_qa

# Redis配置
REDIS_URL=redis://localhost:6379

# JWT密钥
JWT_SECRET=your_jwt_secret_key_here

# DeepSeek API配置
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

### 启动服务

```bash
# 方式一：同时启动所有服务（推荐）
pnpm dev

# 方式二：分别启动各服务
pnpm dev:backend   # 启动后端 API (端口 4000)
pnpm dev:frontend  # 启动用户端 (端口 3000)
pnpm dev:admin     # 启动管理后台 (端口 3001)
```

### 数据库初始化

```bash
# 启动数据库和缓存
docker-compose up -d postgres redis

# 生成 Prisma Client
pnpm db:generate

# 运行数据库迁移
pnpm db:migrate

# 打开 Prisma Studio（可选）
pnpm db:studio
```

### 访问地址

| 服务     | 地址                           |
| -------- | ------------------------------ |
| 用户端   | http://localhost:3000          |
| 管理后台 | http://localhost:3001          |
| API文档  | http://localhost:4000/api/docs |

---

## 常用命令

### 开发命令

```bash
pnpm dev              # 同时启动所有服务
pnpm dev:frontend     # 启动用户端
pnpm dev:admin        # 启动管理后台
pnpm dev:backend      # 启动后端 API
```

### 构建命令

```bash
pnpm build            # 构建所有项目
pnpm build:frontend   # 构建用户端
pnpm build:admin      # 构建管理后台
pnpm build:backend    # 构建后端
```

### 生产命令

```bash
pnpm start            # 启动所有服务（生产模式）
pnpm start:frontend   # 启动用户端（生产模式）
pnpm start:admin      # 启动管理后台（生产模式）
pnpm start:backend    # 启动后端（生产模式）
```

### 数据库命令

```bash
pnpm db:generate      # 生成 Prisma Client
pnpm db:migrate       # 运行数据库迁移
pnpm db:push          # 推送 schema 到数据库
pnpm db:studio        # 打开 Prisma Studio
```

### 代码质量

```bash
pnpm lint             # 代码检查
pnpm lint:fix         # 自动修复代码问题
pnpm typecheck        # 类型检查
```

### 清理与重装

```bash
pnpm clean            # 清理所有 node_modules
pnpm reinstall        # 清理后重新安装依赖
```

---

## Docker Compose 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

---

## 功能模块

### 用户端

- 用户注册/登录
- AI智能问答
- 历史会话管理
- 知识学习
- 智能答题训练
- 错题本
- 个人中心

### 管理后台

- 管理员登录
- 数据统计
- 用户管理
- 知识库管理
- 题库管理
- 会话管理
- 系统设置

---

## API接口

| 模块   | 基础路径         | 说明                 |
| ------ | ---------------- | -------------------- |
| 认证   | `/api/auth`      | 注册、登录、用户信息 |
| 聊天   | `/api/chat`      | 消息发送、会话管理   |
| 知识库 | `/api/knowledge` | 知识检索             |
| 答题   | `/api/quiz`      | 题目获取、答题提交   |
| 管理   | `/api/admin`     | 后台管理接口         |

---

## 数据库

### 核心表结构

| 表名                  | 说明           |
| --------------------- | -------------- |
| `users`               | 用户表         |
| `admins`              | 管理员表       |
| `conversations`       | 会话表         |
| `messages`            | 消息表         |
| `pest_categories`     | 病虫害分类表   |
| `questions`           | 题库表         |
| `quiz_records`        | 答题记录表     |
| `knowledge_documents` | 知识库文档表   |
| `knowledge_chunks`    | 知识分块表     |
| `user_statistics`     | 用户学习统计表 |

### PostgreSQL 扩展

```sql
-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 开发规范

### 代码风格

- TypeScript 严格模式
- ESLint 代码检查
- Prettier 代码格式化

### 提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建/工具更新
```

---

## 版本规划

### Version 1.0 (MVP)

- 用户认证
- AI问答
- RAG知识库
- 历史会话
- 知识答题
- 错题本
- 后台管理

### Version 1.5

- 文档分类管理
- 批量导入知识库
- 专项训练
- 学习排行榜

### Version 2.0

- 图片诊断
- 图像识别
- AI诊断报告

---

## 许可证

MIT License

---

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。
