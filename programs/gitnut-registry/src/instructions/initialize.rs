use anchor_lang::prelude::*;
use crate::state::registry::Registry;
use crate::state::policy::*;
use crate::constants::*;
use crate::events::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Global Registry PDA
    #[account(
        init,
        payer = payer,
        space = Registry::space(),
        seeds = [REGISTRY_SEED],
        bump
    )]
    pub registry: Account<'info, Registry>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let bump = *ctx.bumps.get("registry").ok_or(crate::errors::GitNutError::InvalidPda)?;

    registry.bump = bump;
    registry.authority = ctx.accounts.payer.key();
    registry.default_policy = ProjectPolicy::default_with_allow_any();
    registry.schema_version = Registry::SCHEMA_VERSION;
    registry.project_count = 0;
    registry.created_at = now_ts();
    registry.updated_at = registry.created_at;

    emit!(RegistryInitialized{
        registry: registry.key(),
        authority: registry.authority,
        ts: registry.created_at,
    });

    Ok(())
}
