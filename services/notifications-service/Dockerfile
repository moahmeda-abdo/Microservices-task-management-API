# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY services/notifications-service ./services/notifications-service

RUN npm install
RUN npm run build -w @tm/logger
RUN npm run build -w services/notifications-service

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY packages/logger/package.json ./packages/logger/package.json
COPY services/notifications-service/package.json ./services/notifications-service/package.json

RUN npm install --omit=dev

COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/services/notifications-service/dist ./services/notifications-service/dist

WORKDIR /app/services/notifications-service
EXPOSE 3002
CMD ["node", "dist/index.js"]