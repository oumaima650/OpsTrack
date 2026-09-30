# Étape 1 : Build de l'application React avec Vite
# node:24-alpine = LTS actuel, moins de CVE que node:20-alpine
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 120000 && npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur web Nginx pour servir le build statique
# nginx:1.27-alpine = version stable pinnée, évite les CVE de nginx:alpine flottant
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
