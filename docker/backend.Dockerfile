FROM node:20-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ai-core/package.json ./packages/ai-core/
COPY packages/config/package.json ./packages/config/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm db:generate
RUN pnpm build:backend

EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]
