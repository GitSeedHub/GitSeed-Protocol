# GitWhale

[![Website](https://img.shields.io/badge/Website-gitwhale.one-14F195?style=for-the-badge&logo=vercel&logoColor=000000)](https://gitwhale.one/)
[![X](https://img.shields.io/badge/X-@GitWhaleLab-ffffff?style=for-the-badge&logo=x&logoColor=000000)](https://x.com/GitWhaleLab)

**GitWhale** is an open-source pipeline that brings **verifiable software provenance** to Solana.

It does **not** magically “convert Web2 apps into on-chain programs.”  
Instead, GitWhale makes existing software **importable, buildable, hashable, attestable, and verifiable** — then **anchors** those proofs on Solana so anyone can verify:

- what source code was imported (repo + commit)
- how it was built (build recipe + environment hints)
- what artifacts were produced (hashes, sizes, URIs)
- who attested to the result (signer + policy)
- what was published on-chain (project + version records)

If you want to “Web3-ify” a project, GitWhale gives you the foundation:
**verifiable releases + on-chain registry + reproducible evidence**.

---

## Why GitWhale

Most open-source software today is “trusted” by reputation:
GitHub stars, maintainers, CI screenshots, and social consensus.

GitWhale replaces that with **cryptographic proof**:

- Canonical source archive hashing
- Signed attestations (source / build / release)
- SBOM generation (optional but recommended)
- On-chain anchoring via a Solana program
- Public verification endpoints and SDKs

**The result:** software packages become *verifiable objects*, not just claims.

---

## What GitWhale Is (and Is Not)

### GitWhale is
- A **registry program** on Solana storing project + version metadata
- A **worker pipeline** to import → normalize → build → store → attest → anchor
- An **API** + **web app** to publish and verify releases
- A **CLI** to run the pipeline locally or in CI
- An **SDK** for integrations

### GitWhale is not
- An automatic translator from Web2 apps to Solana programs
- A guarantee that all builds are deterministic (reproducibility is opt-in)
- A replacement for audits or human code review

---

## Disclaimer

GitWhale is experimental software.  
Use at your own risk. No warranty. No promise of financial return.
