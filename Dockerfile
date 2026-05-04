FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci

COPY frontend/ ./frontend/
COPY backend/ ./backend/

RUN npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app/backend
CMD ["node", "dist/server.js"]
