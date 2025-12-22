use anchor_lang::prelude::*;

pub const REGISTRY_SEED: &[u8] = b"gitnut_registry";
pub const PROJECT_SEED: &[u8]  = b"gitnut_project";
pub const VERSION_SEED: &[u8]  = b"gitnut_version";

pub const MAX_PROJECT_SLUG: usize = 48;
pub const MAX_REPO_HOST: usize = 32;      // e.g. "github.com"
pub const MAX_REPO_OWNER: usize = 64;     // e.g. "solana-labs"
pub const MAX_REPO_NAME: usize = 64;      // e.g. "solana"
pub const MAX_REPO_REF: usize = 128;      // e.g. "refs/tags/v1.2.3" or commit sha
pub const MAX_URI: usize = 256;           // storage URI pointer (ar://, s3://, https://, ipfs://, etc.)
pub const MAX_LICENSE: usize = 32;        // SPDX id (best-effort)
pub const MAX_DESCRIPTION: usize = 280;   // short project description
pub const MAX_TAGS: usize = 16;
pub const MAX_TAG_LEN: usize = 24;

pub const MAX_MAINTAINERS: usize = 10;

pub const MAX_ATTESTATIONS_PER_VERSION: usize = 8;
pub const ATTESTATION_HASH_LEN: usize = 32; // sha256

pub const MAX_BLOB_BYTES: u32 = 1024 * 1024 * 512; // 512MB (policy cap)

pub const REGISTRY_BUMP_SLOT: u8 = 255; // unused, but kept for schema stability

pub fn now_ts() -> i64 {
    Clock::get().map(|c| c.unix_timestamp).unwrap_or(0)
}
