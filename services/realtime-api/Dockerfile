# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER nodejs
EXPOSE 3001
CMD ["node", "dist/server.js"]
