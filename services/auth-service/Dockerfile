# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY services/auth-service ./services/auth-service

RUN npm install
RUN npm run build -w @tm/logger
RUN npm run build -w services/auth-service

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY packages/logger/package.json ./packages/logger/package.json
COPY services/auth-service/package.json ./services/auth-service/package.json

RUN npm install --omit=dev

COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist

WORKDIR /app/services/auth-service
EXPOSE 3001
CMD ["node", "dist/index.js"]