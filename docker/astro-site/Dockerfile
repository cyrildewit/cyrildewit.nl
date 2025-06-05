FROM docker.io/library/node:22-slim
RUN npm install -g pnpm@10
RUN pnpm add --global nx@latest
USER "node"
WORKDIR /app