# GitNut Worker

The worker executes the GitNut pipeline:

**Import → Normalize → Build → Store → Attest → Anchor → Cleanup**

It is designed to run as a separate service (container-friendly), driven by a queue (BullMQ + Redis).

## Local development

1. Start Redis and Postgres (API uses Postgres; Worker uses Redis and optional API).
2. Set environment variables:

```bash
cp ../../.env.example .env
# edit values as needed
```

3. Run:

```bash
pnpm -C ../../ install
pnpm -C ../../ dev:worker
```

## Required environment variables

- `REDIS_URL`
- `GITNUT_API_BASE_URL` (optional but recommended)
- `GITNUT_STORAGE_DRIVER` (`local|s3|r2|arweave`)
- `GITNUT_STORAGE_LOCAL_DIR` (when local)
- `SOLANA_RPC_URL`
- `GITNUT_REGISTRY_PROGRAM_ID` (when anchoring on-chain)

## What the worker actually anchors

This reference implementation anchors:
- Source archive hash (sha256)
- Build artifact hash (sha256)
- SBOM hash (sha256)
- A canonical manifest digest

The on-chain program is expected to store **hashes and metadata**, not raw code.
