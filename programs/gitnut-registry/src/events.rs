use anchor_lang::prelude::*;

#[event]
pub struct RegistryInitialized {
    pub registry: Pubkey,
    pub authority: Pubkey,
    pub ts: i64,
}

#[event]
pub struct ProjectRegistered {
    pub registry: Pubkey,
    pub project: Pubkey,
    pub slug: String,
    pub repo_host: String,
    pub repo_owner: String,
    pub repo_name: String,
    pub creator: Pubkey,
    pub ts: i64,
}

#[event]
pub struct ProjectTransferred {
    pub project: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub ts: i64,
}

#[event]
pub struct MaintainersUpdated {
    pub project: Pubkey,
    pub by: Pubkey,
    pub count: u8,
    pub ts: i64,
}

#[event]
pub struct PolicyUpdated {
    pub project: Pubkey,
    pub by: Pubkey,
    pub ts: i64,
}

#[event]
pub struct VersionPublished {
    pub project: Pubkey,
    pub version: Pubkey,
    pub semver: String,
    pub repo_ref: String,
    pub artifact_uri: String,
    pub content_hash: [u8; 32],
    pub ts: i64,
}

#[event]
pub struct VersionDeprecated {
    pub project: Pubkey,
    pub version: Pubkey,
    pub by: Pubkey,
    pub ts: i64,
}

#[event]
pub struct AttestationVerified {
    pub project: Pubkey,
    pub version: Pubkey,
    pub by: Pubkey,
    pub attestation_type: u8,
    pub attestation_hash: [u8; 32],
    pub ts: i64,
}
