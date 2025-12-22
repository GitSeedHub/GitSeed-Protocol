use anchor_lang::prelude::*;
use crate::constants::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct MaintainerSet {
    pub maintainers: Vec<Pubkey>,
}

impl MaintainerSet {
    pub fn is_maintainer(&self, k: &Pubkey) -> bool {
        self.maintainers.iter().any(|m| m == k)
    }

    pub fn space(max: usize) -> usize {
        4 + max * 32
    }

    pub fn validate(&self) -> Result<()> {
        require!(!self.maintainers.is_empty(), crate::errors::GitNutError::EmptyMaintainers);
        require!(self.maintainers.len() <= MAX_MAINTAINERS, crate::errors::GitNutError::TooManyMaintainers);
        Ok(())
    }
}
