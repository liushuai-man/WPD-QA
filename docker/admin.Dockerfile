FROM node:20-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY admin/package.json ./admin/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN cd admin && pnpm build

FROM nginx:alpine

COPY --from=base /app/admin/.next /usr/share/nginx/html
COPY nginx/admin.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]