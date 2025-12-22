FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate   && pnpm install --prod

FROM base AS runner
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 8787
CMD ["node", "dist/main.js"]
