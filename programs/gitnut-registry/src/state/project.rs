use anchor_lang::prelude::*;
use crate::constants::*;
use crate::state::maintainer::*;
use crate::state::policy::*;

#[account]
pub struct Project {
    pub bump: u8,
    pub registry: Pubkey,

    // Identity
    pub slug: String,          // unique key used in PDA derivation
    pub repo_host: String,     // e.g. github.com
    pub repo_owner: String,
    pub repo_name: String,

    pub description: String,   // short
    pub tags: Vec<String>,     // optional tags for discoverability

    // Control
    pub owner: Pubkey,         // primary owner (transferable)
    pub maintainers: MaintainerSet,

    // Optional project-specific policy (if not set, default is used)
    pub policy: ProjectPolicy,

    // State
    pub created_at: i64,
    pub updated_at: i64,
    pub version_count: u64,
    pub is_closed: bool,
}

impl Project {
    pub fn is_authorized(&self, signer: &Pubkey) -> bool {
        if &self.owner == signer { return true; }
        self.maintainers.is_maintainer(signer)
    }

    pub fn space() -> usize {
        // discriminator
        8
        + 1 // bump
        + 32 // registry
        + 4 + MAX_PROJECT_SLUG
        + 4 + MAX_REPO_HOST
        + 4 + MAX_REPO_OWNER
        + 4 + MAX_REPO_NAME
        + 4 + MAX_DESCRIPTION
        + 4 + (MAX_TAGS * (4 + MAX_TAG_LEN))
        + 32 // owner
        + MaintainerSet::space(MAX_MAINTAINERS)
        + (1 + (4 + 16*(4 + MAX_LICENSE)) + 4 + 1) // policy approx
        + 8 + 8 + 8 // timestamps + version_count
        + 1 // is_closed
    }
}
