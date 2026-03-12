# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY services/api-gateway ./services/api-gateway

RUN npm install
RUN npm run build -w @tm/logger
RUN npm run build -w services/api-gateway

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY packages/logger/package.json ./packages/logger/package.json
COPY services/api-gateway/package.json ./services/api-gateway/package.json

RUN npm install --omit=dev

COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/services/api-gateway/dist ./services/api-gateway/dist

WORKDIR /app/services/api-gateway
EXPOSE 3000
CMD ["node", "dist/index.js"]