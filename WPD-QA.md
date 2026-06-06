# WPD-QA

> Wheat Pest & Disease Question Answering System

中文名称：小麦病虫害智能问答与学习平台

---

# 1. 项目简介

## 1.1 项目背景

小麦作为我国重要粮食作物，在生长过程中经常受到病虫害侵袭，例如条锈病、白粉病、赤霉病、蚜虫等。

传统病虫害咨询主要依赖农业专家、农技人员以及线下培训，存在响应速度慢、覆盖范围有限、咨询成本高等问题。

随着大语言模型（LLM）与检索增强生成（RAG）技术的发展，可以构建一个基于农业知识库的智能问答平台，为种植户提供实时、准确、低成本的农业咨询服务。

---

## 1.2 项目定位

WPD-QA 是一个面向农业领域的小麦病虫害智能问答与学习平台。

平台融合：

* AI智能问答
* RAG知识库检索
* 农业知识学习
* 智能答题训练

帮助用户快速获取病虫害知识、防治方案及农业种植建议。

---

## 1.3 项目目标

### Version 1.0（MVP）

构建一个可交付的小麦病虫害智能问答与学习平台。

#### 用户端

* 用户注册登录
* AI智能问答
* RAG知识库检索
* 历史会话管理
* 知识答题训练
* 错题记录
* 个人中心

#### 后台管理

* 管理员登录
* 用户管理
* 知识库管理
* 文档上传
* 题库管理
* 数据统计

#### AI能力

* RAG检索增强生成
* 多轮对话
* 上下文记忆
* 知识来源引用

---

### Version 1.5

#### 知识库增强

* 文档分类管理
* 批量导入知识库
* 自动切片
* 自动向量化

#### 学习系统增强

* 专项训练
* 错题复习
* 学习进度统计
* 学习排行榜

---

### Version 2.0

#### 图片诊断

* 病害图片上传
* 图像识别
* AI诊断报告
* 防治建议生成

---

### Version 2.5

#### 农业Agent

* 工具调用
* 天气查询
* 农药查询
* 智能种植建议

---

### Version 3.0

#### 智慧农业平台

* 农事提醒
* 个性化种植方案
* 区域病害分析
* 农业决策支持

---

# 2. 需求分析

## 2.1 用户画像

### 农户

需求：

* 快速获取病虫害信息
* 获得防治方案
* 获取种植建议

痛点：

* 缺乏专业知识
* 咨询成本高
* 信息来源不统一

---

### 农技人员

需求：

* 快速查询资料
* 辅助指导农户

---

### 农业专业学生

需求：

* 学习病虫害知识
* 查询农业规范
* 备考与实践训练

---

## 2.2 用户场景

### 场景一

用户提问：

> 小麦叶片发黄怎么办？

系统：

* 检索知识库
* 分析病因
* 返回处理建议

---

### 场景二

用户提问：

> 小麦条锈病如何防治？

系统：

* 查询知识库
* 返回症状描述
* 返回防治方案
* 返回预防措施

---

### 场景三（V2）

用户上传病害图片。

系统：

* 图片识别
* 疾病预测
* AI分析
* 输出诊断报告

---

# 3. 功能模块设计

## 3.1 用户模块

### 功能

* 邮箱注册
* 邮箱登录
* JWT认证
* 用户信息管理

### 数据

* 用户ID
* 邮箱
* 昵称
* 头像

---

## 3.2 AI问答模块

### 功能

* 自然语言提问
* AI回答
* 多轮对话
* 上下文记忆
* 历史会话管理

### 流程

用户提问

↓

Retriever检索

↓

RAG知识召回

↓

LLM生成回答

↓

返回结果

---

## 3.3 知识库模块

### 功能

* 文档导入
* 文本切片
* Embedding生成
* 向量存储
* 相似度检索

### 数据来源

* 农业农村部资料
* 病虫害防治手册
* 农业教材
* 学术论文

### 支持格式

* PDF
* DOCX
* TXT
* Markdown

---

## 3.4 会话模块

### 功能

* 创建会话
* 保存历史记录
* 删除会话
* 恢复上下文

---

## 3.5 知识答题模块

### 功能

* 随机练习
* 专项练习
* 自动判题
* AI解析
* 错题记录

---

# 4. 系统架构设计

```text
┌──────────────────────────────────────┐
│       Mobile Web App（Next.js）      │
├──────────────────────────────────────┤
│ 首页                                  │
│ AI问答                                │
│ 知识学习                              │
│ 知识答题                              │
│ 历史会话                              │
│ 个人中心                              │
└──────────────────┬───────────────────┘
                   │ HTTPS
                   ▼

┌──────────────────────────────────────┐
│          Express API Server          │
├──────────────────────────────────────┤
│ Auth Module                           │
│ User Module                           │
│ Chat Module                           │
│ Quiz Module                           │
│ Knowledge Module                      │
│ Upload Module                         │
│ Admin Module                          │
└──────────────────┬───────────────────┘
                   │
                   ▼

┌──────────────────────────────────────┐
│            Mastra AI Layer           │
├──────────────────────────────────────┤
│ Agent                                 │
│ Workflow                              │
│ RAG                                   │
│ Memory                                │
└──────────────┬───────────────┬────────┘
               │               │

               ▼               ▼

      PostgreSQL+pgvector    DeepSeek

               │
               ▼

             Redis
```

---

# 5. 数据库设计

## users（用户表）

```sql
id BIGSERIAL PRIMARY KEY
email VARCHAR(100) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
nickname VARCHAR(50)
avatar VARCHAR(255)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
is_deleted BOOLEAN DEFAULT FALSE
```

---

## admins（管理员表）

```sql
id BIGSERIAL PRIMARY KEY
username VARCHAR(50) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
role VARCHAR(20) DEFAULT 'admin'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
is_deleted BOOLEAN DEFAULT FALSE
```

---

## conversations（会话表）

```sql
id BIGSERIAL PRIMARY KEY
user_id BIGINT NOT NULL
title VARCHAR(255)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

is_deleted BOOLEAN DEFAULT FALSE

FOREIGN KEY (user_id)
REFERENCES users(id)
```

---

## messages（聊天消息表）

```sql
id BIGSERIAL PRIMARY KEY
conversation_id BIGINT NOT NULL
role VARCHAR(20) NOT NULL
content TEXT NOT NULL
prompt_tokens INT DEFAULT 0
completion_tokens INT DEFAULT 0
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
is_deleted BOOLEAN DEFAULT FALSE
FOREIGN KEY (conversation_id)
REFERENCES conversations(id)
```

---

## pest_categories（病虫害分类表）

```sql
id BIGSERIAL PRIMARY KEY
name VARCHAR(100) NOT NULL
description TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

示例：
病害

虫害

杂草

栽培管理

农药使用

````

---

## questions（题库表）

```sql
id BIGSERIAL PRIMARY KEY

title TEXT NOT NULL

options JSONB NOT NULL

answer VARCHAR(10) NOT NULL

analysis TEXT

difficulty SMALLINT DEFAULT 1

category_id BIGINT

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

is_deleted BOOLEAN DEFAULT FALSE

FOREIGN KEY (category_id)
REFERENCES pest_categories(id)
````

difficulty：

1 = 简单

2 = 中等

3 = 困难

````

---

## quiz_records（答题记录表）

```sql
id BIGSERIAL PRIMARY KEY

user_id BIGINT NOT NULL

question_id BIGINT NOT NULL

user_answer VARCHAR(10)

is_correct BOOLEAN

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

is_deleted BOOLEAN DEFAULT FALSE

FOREIGN KEY (user_id)
REFERENCES users(id)

FOREIGN KEY (question_id)
REFERENCES questions(id)
````

---

## knowledge_documents（知识库文档表）

```sql
id BIGSERIAL PRIMARY KEY

title VARCHAR(255) NOT NULL

source VARCHAR(255)

category_id BIGINT

file_name VARCHAR(255)

file_type VARCHAR(50)

file_size BIGINT

upload_user_id BIGINT

content TEXT

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

is_deleted BOOLEAN DEFAULT FALSE

FOREIGN KEY (category_id)
REFERENCES pest_categories(id)

FOREIGN KEY (upload_user_id)
REFERENCES users(id)
```

支持：

PDF

Word

Markdown

TXT

````

---

## knowledge_chunks（知识分块表）

```sql
id BIGSERIAL PRIMARY KEY

document_id BIGINT NOT NULL

chunk_index INT NOT NULL

title VARCHAR(255)

content TEXT NOT NULL

embedding TEXT

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

is_deleted BOOLEAN DEFAULT FALSE

FOREIGN KEY (document_id)
REFERENCES knowledge_documents(id)
````

embedding 字段说明：

当前：

```text
[-0.12,0.45,0.77,...]
```

后续安装 pgvector 后可升级：

```sql
embedding VECTOR(1536)
```

````

---

## user_statistics（用户学习统计）

```sql
id BIGSERIAL PRIMARY KEY

user_id BIGINT UNIQUE

chat_count INT DEFAULT 0

quiz_count INT DEFAULT 0

correct_count INT DEFAULT 0

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id)
REFERENCES users(id)
````

---

# 6. 技术选型

| 模块          | 技术                 |
| ----------- | ------------------ |
| 前端框架        | Next.js 16         |
| UI组件库       | shadcn/ui          |
| 图标库         | Lucide React       |
| CSS方案       | TailwindCSS        |
| 开发语言        | TypeScript         |
| 状态管理        | Zustand            |
| 数据请求        | Axios              |
| 服务端状态管理     | TanStack Query     |
| 表单管理        | React Hook Form    |
| 表单验证        | Zod                |
| Markdown渲染  | React Markdown     |
| 数据表格        | TanStack Table     |
| 后端框架        | Express            |
| AI框架        | Mastra             |
| ORM         | Prisma             |
| 数据库         | PostgreSQL         |
| 缓存          | Redis              |
| 身份认证        | JWT                |
| 文件存储        | Local Storage（MVP） |
| Embedding模型 | BGE-M3             |
| 大模型         | DeepSeek           |
| API文档       | OpenAPI            |
| 容器化         | Docker             |
| 反向代理        | Nginx              |
| 包管理器        | pnpm               |
| Monorepo    | pnpm workspace     |
| 版本控制        | Git + GitHub       |

---

# 7. 项目目录结构

```text
WPD-QA
├── apps
│   ├── frontend
│   ├── admin
│   └── backend
│
├── packages
│   ├── ai-core
│   ├── db
│   ├── shared
│   └── config
│
├── docs
├── docker
├── nginx
├── uploads
├── scripts
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

---

# 8. 后台管理系统设计

## 管理员模块

* 管理员登录
* 权限认证
* JWT鉴权
* 安全退出

## 知识库管理

* 上传文档
* 删除文档
* 文档分类
* 文档查看
* 重新向量化

## 题库管理

* 新增题目
* 编辑题目
* 删除题目
* 批量导入

## 用户管理

* 查看用户
* 查看问答次数
* 查看答题记录

## 数据统计

* 用户总数
* 今日活跃用户
* AI问答次数
* RAG命中率
* 热门问题排行

---

# 9. 权限设计

```text
游客
├── AI问答（限制次数）
└── 浏览知识

普通用户
├── AI问答
├── 历史会话
├── 知识答题
└── 错题本

管理员
├── 知识库管理
├── 题库管理
├── 用户管理
└── 数据统计
```

---

# 10. API设计

## 认证模块

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## AI问答模块

```http
POST   /api/chat/send
GET    /api/chat/conversations
GET    /api/chat/conversations/:id
DELETE /api/chat/conversations/:id
```

## 知识库模块

```http
GET    /api/knowledge
POST   /api/admin/knowledge/upload
DELETE /api/admin/knowledge/:id
```

## 答题模块

```http
GET  /api/quiz/questions
POST /api/quiz/submit
GET  /api/quiz/wrong-records
```

## 管理后台模块

```http
GET    /api/admin/users
GET    /api/admin/questions
POST   /api/admin/questions
PUT    /api/admin/questions/:id
DELETE /api/admin/questions/:id
GET    /api/admin/statistics
```

---

# 11. 部署架构

```text
Internet
    │
    ▼

Nginx
    │

 ┌──┴───────────────┐

 ▼                  ▼

Frontend         Admin

(Next.js)       (Next.js)

     │              │

     └──────┬───────┘
            ▼

      Express API

            │

 ┌──────────┼──────────┐

 ▼          ▼          ▼

PostgreSQL  Redis   Mastra

     │

     ▼

 pgvector

     │

     ▼

 DeepSeek API
```

---

# 12. 产品版本规划

## Version 1.0

### 核心能力

* 用户认证
* AI问答
* RAG知识库
* 历史会话
* 知识答题
* 错题本
* 后台管理

---

## Version 1.5

### 学习平台增强

* 专项训练
* 学习统计
* 学习排行榜
* 知识分类管理

---

## Version 2.0

### 图片诊断

* 图片上传
* 病害识别
* AI诊断报告

---

## Version 2.5

### 农业Agent

* 工具调用
* 天气查询
* 农药推荐

---

## Version 3.0

### 智慧农业平台

* 农事提醒
* 个性化种植建议
* 数据分析平台
* 农业决策支持系统

---

# 13. 成功指标

## Version 1.0

### 功能指标

* 注册成功率 ≥ 95%
* 登录成功率 ≥ 95%
* AI回答成功率 ≥ 95%
* RAG命中率 ≥ 80%

### 性能指标

* API响应时间 ≤ 500ms
* AI平均响应时间 ≤ 5s
* 页面首屏加载时间 ≤ 2s

### 用户指标

* 日活跃用户（DAU）
* 平均会话次数
* 平均答题次数

---

## Version 2.0

### 图片诊断指标

* 图片识别准确率 ≥ 75%
* 用户满意度 ≥ 80%

---

## Version 3.0

### Agent指标

* 工具调用成功率 ≥ 90%
* 用户留存率提升 ≥ 30%
* 咨询效率提升 ≥ 50%

```
```
