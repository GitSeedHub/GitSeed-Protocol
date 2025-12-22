use anchor_lang::prelude::*;
use crate::constants::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct LicensePolicy {
    /// If `allow_any` is true, licenses are not checked.
    pub allow_any: bool,
    /// Allowed SPDX identifiers (best-effort).
    pub allowed: Vec<String>,
}

impl LicensePolicy {
    pub fn space(max_items: usize) -> usize {
        // vec: 4 (len) + items
        // each string: 4 (len) + bytes
        4 + max_items * (4 + MAX_LICENSE)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct ContentPolicy {
    /// Maximum blob size allowed for artifacts.
    pub max_blob_bytes: u32,
    /// If set, tag list must be <= MAX_TAGS and each tag <= MAX_TAG_LEN.
    pub enforce_tags: bool,
}

impl Default for ContentPolicy {
    fn default() -> Self {
        Self {
            max_blob_bytes: MAX_BLOB_BYTES,
            enforce_tags: true,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct ProjectPolicy {
    pub license: LicensePolicy,
    pub content: ContentPolicy,
}

impl ProjectPolicy {
    pub fn default_with_allow_any() -> Self {
        Self {
            license: LicensePolicy { allow_any: true, allowed: vec![] },
            content: ContentPolicy::default(),
        }
    }

    pub fn space() -> usize {
        // conservative: allow up to 16 license entries
        1 + LicensePolicy::space(16) + 4 + 1
    }
}
