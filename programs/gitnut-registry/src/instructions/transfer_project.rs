use anchor_lang::prelude::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TransferProjectArgs {
    pub new_owner: Pubkey,
}

#[derive(Accounts)]
pub struct TransferProject<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [crate::constants::PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,
}

pub fn handler(ctx: Context<TransferProject>, args: TransferProjectArgs) -> Result<()> {
    let project = &mut ctx.accounts.project;
    require!(!project.is_closed, GitNutError::NotClosable);

    // Only owner can transfer ownership (maintainers cannot).
    require!(project.owner == ctx.accounts.signer.key(), GitNutError::Unauthorized);

    let from = project.owner;
    project.owner = args.new_owner;
    project.updated_at = crate::constants::now_ts();

    emit!(ProjectTransferred{
        project: project.key(),
        from,
        to: project.owner,
        ts: project.updated_at,
    });

    Ok(())
}
