use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;
use crate::state::maintainer::MaintainerSet;
use super::_helpers::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SetMaintainersArgs {
    pub maintainers: Vec<Pubkey>,
}

#[derive(Accounts)]
pub struct SetMaintainers<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,
}

pub fn handler(ctx: Context<SetMaintainers>, args: SetMaintainersArgs) -> Result<()> {
    let project = &mut ctx.accounts.project;
    require!(!project.is_closed, GitNutError::NotClosable);

    require_authorized(&project.owner, &project.maintainers, &ctx.accounts.signer.key())?;

    require!(!args.maintainers.is_empty(), GitNutError::EmptyMaintainers);
    require!(args.maintainers.len() <= MAX_MAINTAINERS, GitNutError::TooManyMaintainers);

    project.maintainers = MaintainerSet { maintainers: args.maintainers };
    project.maintainers.validate()?;
    project.updated_at = crate::constants::now_ts();

    emit!(MaintainersUpdated {
        project: project.key(),
        by: ctx.accounts.signer.key(),
        count: project.maintainers.maintainers.len() as u8,
        ts: project.updated_at,
    });

    Ok(())
}
