# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY services/tasks-service ./services/tasks-service

RUN npm install
RUN npm run build -w @tm/logger
RUN npm run build -w services/tasks-service

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY packages/logger/package.json ./packages/logger/package.json
COPY services/tasks-service/package.json ./services/tasks-service/package.json

RUN npm install --omit=dev

COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/services/tasks-service/dist ./services/tasks-service/dist

WORKDIR /app/services/tasks-service
EXPOSE 3003
CMD ["node", "dist/index.js"]