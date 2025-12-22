use anchor_lang::prelude::*;
use crate::errors::GitNutError;

pub fn require_authorized(project_owner: &Pubkey, maintainers: &crate::state::maintainer::MaintainerSet, signer: &Pubkey) -> Result<()> {
    if project_owner == signer { return Ok(()); }
    require!(maintainers.is_maintainer(signer), GitNutError::Unauthorized);
    Ok(())
}

pub fn require_str_max(s: &str, max: usize) -> Result<()> {
    require!(s.as_bytes().len() <= max, GitNutError::StringTooLong);
    Ok(())
}
