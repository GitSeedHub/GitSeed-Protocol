use anchor_lang::prelude::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;
use crate::state::version::Version;
use super::_helpers::*;

#[derive(Accounts)]
pub struct DeprecateVersion<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [crate::constants::PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [crate::constants::VERSION_SEED, project.key().as_ref(), version.semver.as_bytes()],
        bump = version.bump
    )]
    pub version: Account<'info, Version>,
}

pub fn handler(ctx: Context<DeprecateVersion>) -> Result<()> {
    let project = &ctx.accounts.project;
    let version = &mut ctx.accounts.version;

    require!(!project.is_closed, GitNutError::NotClosable);
    require_authorized(&project.owner, &project.maintainers, &ctx.accounts.signer.key())?;

    version.deprecated = true;
    version.updated_at = crate::constants::now_ts();

    emit!(VersionDeprecated{
        project: project.key(),
        version: version.key(),
        by: ctx.accounts.signer.key(),
        ts: version.updated_at,
    });

    Ok(())
}
