FROM node:20-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN cd backend && pnpm prisma generate
RUN cd backend && pnpm build

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]