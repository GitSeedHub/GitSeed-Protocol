use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;
use crate::state::registry::Registry;
use crate::state::maintainer::MaintainerSet;
use crate::state::policy::*;
use super::_helpers::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RegisterProjectArgs {
    pub slug: String,
    pub repo_host: String,
    pub repo_owner: String,
    pub repo_name: String,
    pub description: String,
    pub tags: Vec<String>,
    pub maintainers: Vec<Pubkey>,
}

#[derive(Accounts)]
#[instruction(args: RegisterProjectArgs)]
pub struct RegisterProject<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut, seeds = [REGISTRY_SEED], bump = registry.bump)]
    pub registry: Account<'info, Registry>,

    /// Project PDA derived from slug
    #[account(
        init,
        payer = payer,
        space = Project::space(),
        seeds = [PROJECT_SEED, args.slug.as_bytes()],
        bump
    )]
    pub project: Account<'info, Project>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterProject>, args: RegisterProjectArgs) -> Result<()> {
    // Validate lengths
    require_str_max(&args.slug, MAX_PROJECT_SLUG)?;
    require_str_max(&args.repo_host, MAX_REPO_HOST)?;
    require_str_max(&args.repo_owner, MAX_REPO_OWNER)?;
    require_str_max(&args.repo_name, MAX_REPO_NAME)?;
    require_str_max(&args.description, MAX_DESCRIPTION)?;

    require!(args.tags.len() <= MAX_TAGS, GitNutError::InvalidInput);
    for t in args.tags.iter() {
        require_str_max(t, MAX_TAG_LEN)?;
    }

    require!(args.maintainers.len() <= MAX_MAINTAINERS, GitNutError::TooManyMaintainers);
    require!(!args.maintainers.is_empty(), GitNutError::EmptyMaintainers);

    let project = &mut ctx.accounts.project;
    let bump = *ctx.bumps.get("project").ok_or(GitNutError::InvalidPda)?;

    project.bump = bump;
    project.registry = ctx.accounts.registry.key();

    project.slug = args.slug.clone();
    project.repo_host = args.repo_host.clone();
    project.repo_owner = args.repo_owner.clone();
    project.repo_name = args.repo_name.clone();
    project.description = args.description.clone();
    project.tags = args.tags.clone();

    project.owner = ctx.accounts.payer.key();
    project.maintainers = MaintainerSet { maintainers: args.maintainers.clone() };
    project.maintainers.validate()?;

    project.policy = ProjectPolicy::default_with_allow_any();
    project.created_at = now_ts();
    project.updated_at = project.created_at;
    project.version_count = 0;
    project.is_closed = false;

    // Update registry counters
    let registry = &mut ctx.accounts.registry;
    registry.project_count = registry.project_count.saturating_add(1);
    registry.updated_at = now_ts();

    emit!(ProjectRegistered{
        registry: registry.key(),
        project: project.key(),
        slug: project.slug.clone(),
        repo_host: project.repo_host.clone(),
        repo_owner: project.repo_owner.clone(),
        repo_name: project.repo_name.clone(),
        creator: ctx.accounts.payer.key(),
        ts: project.created_at,
    });

    Ok(())
}
