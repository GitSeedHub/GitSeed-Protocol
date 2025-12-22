use anchor_lang::prelude::*;
use crate::errors::GitNutError;
use crate::state::project::Project;

#[derive(Accounts)]
pub struct CloseProject<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        close = signer,
        seeds = [crate::constants::PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,
}

pub fn handler(ctx: Context<CloseProject>) -> Result<()> {
    let project = &mut ctx.accounts.project;

    // Only owner can close.
    require!(project.owner == ctx.accounts.signer.key(), GitNutError::Unauthorized);

    // Mark as closed before close (kept for future CPI patterns).
    project.is_closed = true;
    project.updated_at = crate::constants::now_ts();

    Ok(())
}
