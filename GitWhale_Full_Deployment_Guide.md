# GitWhale Deployment Guide

This document explains how to deploy GitWhale from zero to a working system: 

- Local development (localnet)
- Devnet deployment
- Production-style deployment (Docker Compose / Kubernetes)

GitWhale is a multi-service system:

- programs/gitnut-registry (Solana Anchor program)
- apps/api (REST API)
- apps/worker (pipeline workers)
- apps/web (Next.js frontend)
- apps/indexer (optional but recommended)
- Postgres + Redis + object storage (S3-compatible / R2 / Arweave / local)

---

## 0) Quick Glossary

- **Project**: a GitHub repo registered in GitNut with maintainers and policies.
- **Release**: verifiable publication binding source → build → artifacts → attestations → on-chain anchor.
- **Attestation**: signed statement proving integrity (source/build/release/SBOM).
- **Anchor**: minimal release record written to Solana for public verification.
- **Indexer**: subscribes to on-chain events and stores searchable state in Postgres.

---

## 1) Minimum Requirements

### 1.1 Recommended Machine

- CPU: 4 cores minimum (8+ recommended)
- RAM: 16GB minimum (32GB recommended if building larger repos)
- Disk: 50GB+ for caches/artifacts
- OS: Linux/macOS preferred (Windows via WSL2 is workable)

### 1.2 Required Tools

Install these locally:

- Node.js 20+ (recommended via nvm)
- pnpm 9+
- Docker + Docker Compose
- Rust stable
- Solana CLI
- Anchor CLI

Example install commands (Linux/macOS):

```bash
# Node via nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20

# pnpm
corepack enable
corepack prepare pnpm@9.15.0 --activate

# Rust
curl https://sh.rustup.rs -sSf | sh
rustup default stable

# Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
solana --version

# Anchor (requires cargo)
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
anchor --version

# Docker
docker --version
docker compose version
```

## 2) Repository Setup

### 2.1 Clone

```bash
git clone <YOUR_REPO_URL> gitnut
cd gitnut
```

### 2.2 Install dependencies

```bash
pnpm install
```

### 2.3 Copy environment template

Pick one:

```bash
cp .env.example .env
# or
cp .env.localnet.example .env
# or
cp .env.docker.example .env
```

## 3) Core Architecture: What Must Run

To have a functional GitNut system, you must run:

- Postgres (API + Indexer)
- Redis (job queue)
- Object storage (artifacts + logs + archives)
- Solana cluster (localnet or devnet)
- Anchor program (gitnut-registry)
- API service
- Worker service
- Web app (optional for CLI-only usage)
- Indexer (recommended)

## 4) Localnet Deployment (Fastest)

### 4.1 Start local infrastructure

If you have infra/docker/docker-compose.yml:

```bash
docker compose -f infra/docker/docker-compose.yml up -d
docker compose -f infra/docker/docker-compose.yml ps
```

Typical containers:

- postgres
- redis
- minio (S3-compatible)
- otel collector (optional)
- prometheus/grafana (optional)

### 4.2 Start Solana local validator

Use scripts if present:

```bash
bash configs/localnet/solana-validator.sh
```

Or manual:

```bash
solana config set --url localhost
solana-test-validator --reset --limit-ledger-size
```

In another terminal:

```bash
solana config get
solana airdrop 10
```

### 4.3 Deploy Anchor program (gitnut-registry)

```bash
cd programs/gitnut-registry
anchor build
anchor deploy
```

Capture Program ID output. You will need it in .env.

Example:

```bash
export GITNUT_REGISTRY_PROGRAM_ID="<PROGRAM_ID>"
```

### 4.4 Configure .env for localnet

Edit .env:

```env
NODE_ENV=development

SOLANA_CLUSTER=localnet
SOLANA_RPC_URL=http://127.0.0.1:8899
SOLANA_WS_URL=ws://127.0.0.1:8900

GITNUT_REGISTRY_PROGRAM_ID=<PROGRAM_ID>

DATABASE_URL=postgresql://gitnut:gitnut@localhost:5432/gitnut?schema=public
REDIS_URL=redis://localhost:6379

STORAGE_DRIVER=s3
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=gitnut
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

ATTESTATION_SIGNER_KEY_PATH=./.keys/attestor.key.json
```

### 4.5 Create attestation signer key

```bash
mkdir -p .keys
node scripts/keygen.ts --out .keys/attestor.key.json
```

### 4.6 Database migration

From repo root:

```bash
pnpm --filter @gitnut/api prisma migrate deploy
pnpm --filter @gitnut/api prisma db seed
```

### 4.7 Start API

```bash
pnpm --filter @gitnut/api dev
```

API should be up (example):

```bash
curl -s http://localhost:3001/health
```

### 4.8 Start Worker

```bash
pnpm --filter @gitnut/worker dev
```

### 4.9 Start Indexer (recommended)

```bash
pnpm --filter @gitnut/indexer dev
```

### 4.10 Start Web

```bash
pnpm --filter @gitnut/web dev
```

## 5) Devnet Deployment (Public Testing)

### 5.1 Configure Solana CLI

```bash
solana config set --url https://api.devnet.solana.com
solana airdrop 2
```

### 5.2 Deploy program to devnet

```bash
cd programs/gitnut-registry
anchor build
anchor deploy --provider.cluster devnet
```

Save Program ID and update .env:

```env
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WS_URL=wss://api.devnet.solana.com

GITNUT_REGISTRY_PROGRAM_ID=<DEVNET_PROGRAM_ID>
```

### 5.3 Storage selection for devnet

For devnet, you should use a real storage backend:

- Cloudflare R2 (recommended)
- AWS S3
- MinIO (self-hosted)

Example R2 env:

```env
STORAGE_DRIVER=s3
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=gitnut
S3_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
S3_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
```

### 5.4 Run API/Worker/Indexer in Docker (recommended)

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

If API/Worker containers are included:

```bash
docker compose -f infra/docker/docker-compose.yml logs -f api
docker compose -f infra/docker/docker-compose.yml logs -f worker
docker compose -f infra/docker/docker-compose.yml logs -f indexer
```

## 6) Production Deployment (Docker Compose)

### 6.1 Prepare server

Use a VPS or bare metal

Open ports:

- 80/443 for Web/API (via reverse proxy)
- 5432 optional (usually internal only)
- 6379 optional (internal only)

### 6.2 Use a reverse proxy

Recommended: Nginx or Caddy.

Example (Nginx concept):

- api.gitnut.org -> API container
- gitnut.org -> Web container

### 6.3 Run with Compose

```bash
docker compose -f infra/docker/docker-compose.yml up -d
docker compose -f infra/docker/docker-compose.yml ps
```

### 6.4 Observability

If you included Prometheus/Grafana:

- check metrics endpoint (API/Worker)
- check logs
- set alerts

## 7) Production Deployment (Kubernetes)

### 7.1 Apply base manifests

```bash
kubectl apply -f infra/kubernetes/base/
```

### 7.2 Choose overlay

```bash
kubectl apply -k infra/kubernetes/overlays/staging
# or
kubectl apply -k infra/kubernetes/overlays/prod
```

### 7.3 Secrets management

Use Kubernetes Secrets:

- database URL
- redis URL
- storage keys
- attestation signer key

Example:

```bash
kubectl create secret generic gitnut-secrets   --from-literal=DATABASE_URL="postgresql://..."   --from-literal=REDIS_URL="redis://..."   --from-literal=S3_ACCESS_KEY_ID="..."   --from-literal=S3_SECRET_ACCESS_KEY="..."   --from-file=ATTESTATION_SIGNER_KEY_PATH="./.keys/attestor.key.json"
```

## 8) First Run: Create a Project and Publish a Release

You can do this via Web UI or CLI.

### 8.1 CLI auth (wallet or GitHub OAuth)

Example (wallet signin):

```bash
pnpm --filter @gitnut/cli dev -- auth wallet
```

### 8.2 Register a project

```bash
pnpm --filter @gitnut/cli dev -- project register   --repo https://github.com/<owner>/<repo>   --name "<Project Name>"   --default-branch main
```

### 8.3 Import source

```bash
pnpm --filter @gitnut/cli dev -- import   --repo https://github.com/<owner>/<repo>   --ref <commit_or_tag>
```

### 8.4 Normalize

```bash
pnpm --filter @gitnut/cli dev -- normalize   --project <project_id>   --ref <commit_or_tag>
```

### 8.5 Build

```bash
pnpm --filter @gitnut/cli dev -- build   --project <project_id>   --ref <commit_or_tag>
```

### 8.6 Store artifacts

```bash
pnpm --filter @gitnut/cli dev -- store   --project <project_id>   --ref <commit_or_tag>
```

### 8.7 Attest

```bash
pnpm --filter @gitnut/cli dev -- attest   --project <project_id>   --ref <commit_or_tag>
```

### 8.8 Anchor on Solana (publish)

```bash
pnpm --filter @gitnut/cli dev -- publish   --project <project_id>   --version 0.1.0   --ref <commit_or_tag>
```

### 8.9 Verify release

```bash
pnpm --filter @gitnut/cli dev -- verify   --project <project_id>   --version 0.1.0
```

## 9) Common "It Doesn’t Work" Checklist

### 9.1 Program ID mismatch

- Ensure .env uses the deployed program ID
- Ensure Solana RPC points to correct cluster

### 9.2 Postgres not migrated

```bash
pnpm --filter @gitnut/api prisma migrate deploy
```

### 9.3 Redis not reachable

```bash
redis-cli -u redis://localhost:6379 ping
```

### 9.4 Storage misconfigured

Check bucket existence and access:

- MinIO console
- S3/R2 credentials
- endpoint correct

### 9.5 Worker not consuming jobs

- verify queue connection
- check worker logs
- ensure API is producing jobs

## 10) Security Notes (Must Read)

- Keep ATTESTATION_SIGNER_KEY secret.
- Use least privilege IAM keys for S3/R2.
- Restrict builder network access in production.
- Treat build sandbox as hostile input:
  - limit CPU/RAM/time
  - isolate filesystem
  - disallow privileged containers
- Enable rate limiting for API.
- Turn on audit logs.

## 11) Recommended Production Defaults

- API: 2 replicas
- Worker: 2–10 replicas (depends on workload)
- Indexer: 1–2 replicas
- Postgres: managed service preferred
- Redis: managed service preferred
- Storage: R2/S3 preferred
- TLS: Cloudflare / Caddy / Nginx

## 12) Support Commands

Show versions:

```bash
node -v
pnpm -v
solana --version
anchor --version
docker --version
```

Health checks:

```bash
curl -s http://localhost:3001/health
curl -s http://localhost:3000
```

Logs:

```bash
docker compose -f infra/docker/docker-compose.yml logs -f api
docker compose -f infra/docker/docker-compose.yml logs -f worker
docker compose -f infra/docker/docker-compose.yml logs -f indexer
```

## 13) What "Deployed and Working" Looks Like

You are successfully deployed if:

- API health endpoint returns ok
- Worker consumes jobs and produces artifacts
- Registry program is deployed and callable
- Publish flow writes on-chain events
- Indexer sees events and stores them
- Web UI displays project/release status

End of document.
