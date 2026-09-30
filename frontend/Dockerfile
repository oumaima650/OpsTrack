# Étape 1 : Build de l'application React avec Vite
# node:24-alpine = LTS actuel, moins de CVE que node:20-alpine
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 120000 && npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur web Nginx pour servir le build statique
FROM nginx:alpine AS runner
RUN apk update && apk upgrade --no-cache
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
