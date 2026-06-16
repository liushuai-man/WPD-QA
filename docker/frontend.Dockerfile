FROM node:20-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN cd frontend && pnpm build

FROM nginx:alpine

COPY --from=base /app/frontend/.next /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]