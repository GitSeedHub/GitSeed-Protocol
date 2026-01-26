# Security Policy

GitWhale is an open-source system that anchors verifiable software metadata on Solana and provides a pipeline for importing, normalizing, building, storing, and attesting to source artifacts.

This document explains how to report security issues, what is in scope, and how we handle disclosures.

---

## Supported Versions

GitWhale is under active development. We classify releases as follows:

- **Stable**: tagged releases (e.g. `v1.2.3`) on the default branch.
- **Pre-release**: release candidates (`-rc.*`), betas, and alphas.
- **Main**: the default branch (may include unfinished changes).

We provide security fixes for:

- The latest **Stable** release
- The **Main** branch (best-effort)

Pre-releases may receive fixes, but without guaranteed timelines.

---

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report privately using one of the following:

1. **GitHub Security Advisories** (preferred): use the “Report a vulnerability” button in the repo.
2. Email: `security@GitWhale.one` (replace with your actual security mailbox).

Include:

- A clear description of the issue and its impact
- Steps to reproduce (PoC if possible)
- Affected component(s) (programs/api/worker/web/sdk)
- Any logs, stack traces, or transaction signatures
- Your suggested fix (optional)

### PGP

If you want to encrypt your report, publish your PGP key in the repo and replace the block below.

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
(ADD YOUR PGP KEY HERE)
-----END PGP PUBLIC KEY BLOCK-----
```

---

## Response Targets

We aim for:

- **Acknowledgement**: within **48 hours**
- **Initial triage**: within **5 business days**
- **Fix plan**: within **10 business days** for confirmed high/critical issues

Timelines may vary based on complexity and availability, but we will keep you updated.

---

## Scope

### In Scope

**On-chain program**
- `programs/GitWhale-registry` and related IDL/tests

**Core services**
- `apps/api` (auth, project/release endpoints, webhooks)
- `apps/worker` (import/normalize/build/store/attest/anchor pipeline)
- `apps/indexer` (event subscriber/processor/checkpoints)

**Client tooling**
- `apps/cli`
- `packages/sdk`
- `packages/shared`

**Infrastructure templates**
- `infra/docker`, `infra/kubernetes`, `infra/helm`, `deployments/systemd`

**Security-sensitive areas**
- Signature / key handling (wallet sign-in, attestation signing keys)
- Build sandboxing and isolation
- Supply-chain integrity (SBOM, reproducible builds, provenance)
- Authorization boundaries (project ownership, maintainers, policies)
- Webhook verification and request signing
- Rate limiting / abuse prevention

### Out of Scope

- Vulnerabilities in third-party dependencies without a GitNut-specific exploit path (still welcome as FYI)
- Issues requiring physical access to infrastructure
- Self-XSS or social engineering without a code execution path
- Denial of service requiring unrealistic resources (unless it affects Solana program safety)
- Spam / phishing / typo-squatting reports (use platform reporting)

---

## Security Model (High-Level)

GitWhale is designed around these principles:

1. **Verifiability over trust**  
   We anchor hashes, manifests, and attestations on-chain so anyone can verify provenance.

2. **Least privilege**  
   Service accounts and keys must be scoped and rotated.

3. **Defense in depth**  
   Multiple independent checks: policy enforcement, sandbox restrictions, on-chain constraints, and monitoring.

4. **Fail closed**  
   When verification fails (hash mismatch, invalid attestation), publishing must be rejected.

---

## Coordinated Disclosure

We support coordinated disclosure:

- Please give us a reasonable time window to patch before public disclosure.
- We will credit researchers who want attribution.
- If the issue is critical, we may request a temporary embargo.

---

## Rewards / Bounties

If you operate a bug bounty program, link it here and specify eligibility.

---

## How to Run Security Checks Locally

From repo root:

- Dependency audit:
  - `pnpm -r audit --audit-level=high` (or your preferred tooling)
- Lint + typecheck:
  - `pnpm -r lint`
  - `pnpm -r typecheck`
- Tests:
  - `pnpm -r test`
- Program tests:
  - `pnpm --filter @gitnut/gitnut-registry test` (or `anchor test` if configured)

If you add additional security scripts under `scripts/security`, run:

- `pnpm ts-node scripts/security/run-security-suite.ts`

---

## Security Contacts

- `security@GitWhale.one` (replace)
- GitHub Security Advisories: preferred
