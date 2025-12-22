use anchor_lang::prelude::*;
use crate::constants::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum AttestationType {
    Source = 1,
    Build = 2,
    Sbom  = 3,
    Release = 4,
}

impl AttestationType {
    pub fn from_u8(v: u8) -> Option<Self> {
        match v {
            1 => Some(Self::Source),
            2 => Some(Self::Build),
            3 => Some(Self::Sbom),
            4 => Some(Self::Release),
            _ => None,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct AttestationRecord {
    pub attestation_type: u8,
    pub hash: [u8; 32],
    pub verifier: Pubkey,
    pub verified_at: i64,
}

impl AttestationRecord {
    pub fn space() -> usize {
        1 + 32 + 32 + 8
    }
}

#[account]
pub struct Version {
    pub bump: u8,
    pub project: Pubkey,

    // Identity
    pub semver: String,        // e.g. "1.2.3" or "0.0.0+commit"
    pub repo_ref: String,      // commit sha or tag ref
    pub artifact_uri: String,  // pointer to artifact bundle
    pub content_hash: [u8; 32],// canonical hash of bundle
    pub license: String,       // SPDX id best-effort
    pub artifact_bytes: u32,   // reported size

    // Attestations
    pub attestations: Vec<AttestationRecord>,

    // State
    pub created_at: i64,
    pub updated_at: i64,
    pub deprecated: bool,
}

impl Version {
    pub fn space() -> usize {
        8
        + 1
        + 32
        + 4 + 32 // semver
        + 4 + MAX_REPO_REF
        + 4 + MAX_URI
        + 32
        + 4 + MAX_LICENSE
        + 4
        + 4 + (MAX_ATTESTATIONS_PER_VERSION * AttestationRecord::space())
        + 8 + 8
        + 1
    }

    pub fn has_attestation(&self, t: u8, h: &[u8; 32]) -> bool {
        self.attestations.iter().any(|a| a.attestation_type == t && &a.hash == h)
    }
}
