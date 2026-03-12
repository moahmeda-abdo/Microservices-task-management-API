# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY services/users-service ./services/users-service

RUN npm install
RUN npm run build -w @tm/logger
RUN npm run build -w services/users-service

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY packages/logger/package.json ./packages/logger/package.json
COPY services/users-service/package.json ./services/users-service/package.json

RUN npm install --omit=dev

COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/services/users-service/dist ./services/users-service/dist

WORKDIR /app/services/users-service
EXPOSE 3004
CMD ["node", "dist/index.js"]