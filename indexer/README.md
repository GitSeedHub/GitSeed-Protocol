# GitNut Indexer

Optional service that listens to Solana logs and persists GitNut registry-related events into Postgres.

This reference implementation uses `Connection.onLogs` and is intentionally conservative.
For high-throughput production deployments, use a Geyser plugin or a dedicated indexing stack.

## Env

- `SOLANA_RPC_URL`
- `GITNUT_REGISTRY_PROGRAM_ID`
- `DATABASE_URL`

## Run

```bash
pnpm -C ../../ dev:indexer
```
