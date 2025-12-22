use anchor_lang::prelude::*;
use crate::state::policy::*;
use crate::constants::*;

#[account]
pub struct Registry {
    pub bump: u8,
    pub authority: Pubkey,
    /// Default policy applied if project policy is not set.
    pub default_policy: ProjectPolicy,
    /// Arbitrary string version for schema evolution
    pub schema_version: u16,
    /// Total projects registered (for analytics only)
    pub project_count: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

impl Registry {
    pub const SCHEMA_VERSION: u16 = 1;

    pub fn space() -> usize {
        // 8 discriminator + fields
        8
        + 1 // bump
        + 32 // authority
        + 1 + (4 + 16 * (4 + MAX_LICENSE)) + 4 + 1 // default_policy (approx)
        + 2 // schema_version
        + 8 // project_count
        + 8 // created_at
        + 8 // updated_at
    }
}
