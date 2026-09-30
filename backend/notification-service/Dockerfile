# Étape 1 : Build TypeScript -> JavaScript
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npx @nestjs/cli build

# Étape 2 : Image finale d'exécution (Production)
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3002
CMD ["node", "dist/main.js"]
