# GitNut Web

Next.js (App Router) frontend for GitNut.

## Requirements
- Node.js >= 20
- pnpm >= 9

## Local development
From the repo root:

```bash
pnpm -w install
pnpm --filter @gitnut/web dev
```

By default the app expects the API server at `http://localhost:8787`.
Set:

```bash
export NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

## What this app does
- Wallet sign-in (message signing) to obtain a session token from the API
- Browse projects and releases
- View verification / attestations for a release
- Trigger imports/publish flows (in a real deployment you would gate these behind permissions)
