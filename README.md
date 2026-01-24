
![1500x500](https://github.com/user-attachments/assets/6b8bcd8c-324f-434f-b693-8d8e197c0917)

# GitSeed

[![Website](https://img.shields.io/badge/Website-gitseed.org-14F195?style=for-the-badge&logo=vercel&logoColor=000000)](https://gitseed.org/)
[![X](https://img.shields.io/badge/X-@GitSeedHub-ffffff?style=for-the-badge&logo=x&logoColor=000000)](https://x.com/GitSeedHub)

A93ojnVNdYkqQtQZB5sLNARrbLxL34Vd4CWgdDcEpump


**GitSeed** is an open-source pipeline that brings **verifiable software provenance** to Solana.

It does **not** magically “convert Web2 apps into on-chain programs.”  
Instead, GitSeed makes existing software **importable, buildable, hashable, attestable, and verifiable** — then **anchors** those proofs on Solana so anyone can verify:

- what source code was imported (repo + commit)
- how it was built (build recipe + environment hints)
- what artifacts were produced (hashes, sizes, URIs)
- who attested to the result (signer + policy)
- what was published on-chain (project + version records)

If you want to “Web3-ify” a project, GitSeed gives you the foundation:
**verifiable releases + on-chain registry + reproducible evidence**.

---

## Why GitSeed

Most open-source software is “trusted” by reputation:
GitHub stars, maintainers, and CI screenshots.

GitSeed replaces that with **cryptographic proof**:

- Canonical source archive hashing
- Signed attestations (source/build/release)
- SBOM generation (optional but recommended)
- On-chain anchoring (Solana program)
- Public verification endpoints and SDK

**The result:** software packages become *verifiable objects*.

---

## What GitSeed Is (and Is Not)

### GitSeed is
- A **registry program** on Solana to store project + version metadata
- A **worker pipeline** to import → normalize → build → store → attest → anchor
- An **API** + **web app** to publish and verify releases
- A **CLI** to run the pipeline and publish from your machine/CI
- An **SDK** for integrations

### GitSeed is not
- An automatic translator that turns Web2 server apps into Solana programs
- A guarantee that arbitrary builds are deterministic (you must opt-in to reproducibility)
- A replacement for code review or audits

---

## Repository Layout

This repository is a monorepo (pnpm + turbo) with:

- `apps/web` — Next.js web UI
- `apps/api` — REST API for projects, releases, attestations, jobs
- `apps/worker` — import/normalize/build/store/attest/anchor pipeline
- `apps/cli` — CLI entrypoint for local/CI usage
- `apps/indexer` — optional Solana event indexer
- `programs/gitnut-registry` — Anchor program (Rust) storing registry state
- `packages/sdk` — TypeScript SDK for integrations
- `packages/shared` — shared crypto/utils/types across apps
- `packages/ui` — shared UI components

Docs live in `docs/`. Infrastructure templates live in `infra/`.

---

## Core Concepts

### Project
A named package entry anchored on-chain.
Projects have:
- owner / maintainers
- policy settings
- metadata (optional)

### Version
A published release of a project.
A version references:
- source identity (repo + commit + archive hash)
- build identity (recipe + builder hints + output hashes)
- storage references (URIs)
- attestations

### Attestation
A signed statement that binds input → output.
GitSeed supports:
- source attestation
- build attestation
- release attestation
- SBOM attestation (optional)

### Anchor
Writing a compact, immutable record to Solana:
- project id
- version label
- hashes + URIs (or references)
- attestation digest

---

## Quickstart (Localnet)

### 1) Requirements

- Node.js 20+
- pnpm 9+
- Rust toolchain (stable)
- Solana CLI
- Anchor

Optional:
- Docker (recommended for worker sandbox and local infra)

### 2) Install

```bash
pnpm -r install
```

### 3) Run local infrastructure

```bash
pnpm dev:infra:up
```

This will bring up Postgres, Redis, and an S3-compatible store (MinIO) via `infra/docker`.

### 4) Start Solana local validator and deploy program

```bash
bash configs/localnet/solana-validator.sh
bash configs/localnet/airdrop.sh
bash configs/localnet/deploy-programs.sh
```

### 5) Run API, Worker, Web

In separate terminals:

```bash
pnpm --filter @gitnut/api dev
pnpm --filter @gitnut/worker dev
pnpm --filter @gitnut/web dev
```

### 6) Try the CLI pipeline

```bash
pnpm --filter @gitnut/cli dev -- import --repo https://github.com/someorg/somerepo --ref main
pnpm --filter @gitnut/cli dev -- normalize --job <JOB_ID>
pnpm --filter @gitnut/cli dev -- build --job <JOB_ID>
pnpm --filter @gitnut/cli dev -- store --job <JOB_ID>
pnpm --filter @gitnut/cli dev -- attest --job <JOB_ID>
pnpm --filter @gitnut/cli dev -- anchor --job <JOB_ID>
```

---

## Quickstart (Devnet)

1) Set your Solana cluster to devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

2) Ensure `ANCHOR_WALLET` points to a funded keypair:

```bash
export ANCHOR_WALLET="$HOME/.config/solana/id.json"
solana airdrop 2
```

3) Deploy the registry program:

```bash
cd programs/gitnut-registry
anchor build
anchor deploy --provider.cluster devnet
```

4) Update API/Worker config to use devnet and the deployed program id.

---

## Configuration

GitSeed uses environment files:

- `.env.example` — base template
- `.env.localnet.example` — localnet defaults
- `.env.docker.example` — docker overrides
- `.env.k8s.example` — Kubernetes baseline

Recommended approach:

```bash
cp .env.localnet.example .env
```

Key settings:

- `DATABASE_URL` — Postgres
- `REDIS_URL` — job queue
- `STORAGE_DRIVER` — `local | s3 | r2 | arweave`
- `SOLANA_RPC_URL` — cluster RPC
- `GITNUT_REGISTRY_PROGRAM_ID` — deployed Anchor program id
- `ATTESTATION_SIGNER_KEY` — base64 or path to signing key (do not commit)

---

## Pipeline Overview

GitSeed processes a release in stages:

1. **Import**
   - Clone repo / fetch tarball
   - Verify remote identity and commit reference
   - Generate canonical source archive

2. **Normalize**
   - Detect stack (node/python/rust/static)
   - Extract metadata (license, manifests)
   - Produce `gitnut.json` manifest

3. **Build**
   - Run build inside sandboxed container
   - Apply CPU/memory/time/network limits
   - Record build recipe and outputs

4. **Store**
   - Upload artifacts to storage backend
   - Record immutable URIs and checksums

5. **Attest**
   - Generate attestations (source/build/release)
   - Optionally generate SBOM and attach it
   - Sign with attestation signer key

6. **Anchor**
   - Publish a compact record to Solana registry program
   - Emit events for indexer

---

## Storage Backends

GitSeed supports pluggable storage:

- **Local** (dev/testing)
- **S3-compatible** (AWS S3, MinIO, etc.)
- **Cloudflare R2**
- **Arweave** (optional; cost model differs)

To change storage, set:

- `STORAGE_DRIVER=s3`
- S3 settings: bucket, endpoint, access keys, region

---

## Security Notes

GitSeed touches sensitive areas (build execution, signing, on-chain publishing).

Key rules:

- Never run untrusted builds outside a sandbox.
- Keep attestation signer keys in a secrets manager.
- Disable network in build containers unless allowlisted.
- Require policy checks for license compliance and content constraints.
- Treat webhooks as hostile input: verify signatures + timestamps.

See:
- `SECURITY.md`
- `docs/threat-model.md`
- `docs/trust-assumptions.md`
- `docs/security-checklist.md`

---

## Commands

### Monorepo
```bash
pnpm -r lint
pnpm -r typecheck
pnpm -r test
```

### Program
```bash
cd programs/gitnut-registry
anchor test
```

### Local infra
```bash
pnpm dev:infra:up
pnpm dev:infra:down
```

---

## API

The API exposes endpoints for:

- projects
- releases
- attestations
- jobs
- webhooks
- verification

See:
- `docs/api.md`

---

## SDK

The TypeScript SDK provides:

- PDA helpers
- instruction builders
- parsers
- typed clients

See:
- `docs/sdk.md`

---

## Contributing

We welcome contributions.

- Start with `docs/overview.md` and `docs/architecture.md`
- Run tests locally before PRs
- Follow `CODE_OF_CONDUCT.md`
- Open PRs using the provided template

See:
- `CONTRIBUTING.md`

---

## Governance

GitNut governance, maintainer rules, and decision processes:

- `GOVERNANCE.md`

---

## License

See `LICENSE` and `NOTICE`.  
If you publish third-party code through GitNut, you are responsible for complying with upstream licenses.

---

## Disclaimer

GitSeed is experimental software.  
Use at your own risk. No warranty. No promise of financial return.

See `DISCLAIMER.md`
