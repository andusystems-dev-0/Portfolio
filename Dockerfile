FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# nginx-unprivileged runs as user `nginx` (uid 101) by default, listens on
# 8080 (no CAP_NET_BIND_SERVICE needed), and uses writable cache/log dirs
# inside /tmp. This lets the K8s pod run with runAsNonRoot, dropAll
# capabilities, and readOnlyRootFilesystem cleanly — see
# andusystems-portfolio/apps/portfolio/manifest.yml.
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
