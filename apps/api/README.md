# GitNut API

REST/JSON API for GitNut.

## Stack
- Fastify (HTTP)
- Prisma (Postgres)
- BullMQ (Redis) for background jobs
- Wallet-based auth (message signing) + optional GitHub OAuth

## Local development
From repo root:

```bash
pnpm -w install
pnpm --filter @gitnut/api dev
```

Start dependencies (Postgres + Redis) via docker-compose at repo root or your own setup.

Then:

```bash
cd apps/api
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

Default port: 8787
