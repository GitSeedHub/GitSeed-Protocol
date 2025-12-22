use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;
use crate::state::registry::Registry;
use crate::state::version::Version;
use super::_helpers::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PublishVersionArgs {
    pub semver: String,
    pub repo_ref: String,
    pub artifact_uri: String,
    pub content_hash: [u8; 32],
    pub license: String,
    pub artifact_bytes: u32,
}

#[derive(Accounts)]
#[instruction(args: PublishVersionArgs)]
pub struct PublishVersion<'info> {
    #[account(mut)]
    pub publisher: Signer<'info>,

    #[account(seeds = [REGISTRY_SEED], bump = registry.bump)]
    pub registry: Account<'info, Registry>,

    #[account(
        mut,
        seeds = [PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    /// Version PDA derived from (project, semver)
    #[account(
        init,
        payer = publisher,
        space = Version::space(),
        seeds = [VERSION_SEED, project.key().as_ref(), args.semver.as_bytes()],
        bump
    )]
    pub version: Account<'info, Version>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<PublishVersion>, args: PublishVersionArgs) -> Result<()> {
    let project = &mut ctx.accounts.project;
    require!(!project.is_closed, GitNutError::NotClosable);

    // Authorization
    super::_helpers::require_authorized(&project.owner, &project.maintainers, &ctx.accounts.publisher.key())?;

    // Validate strings
    require_str_max(&args.semver, 32)?;
    require_str_max(&args.repo_ref, MAX_REPO_REF)?;
    require_str_max(&args.artifact_uri, MAX_URI)?;
    require_str_max(&args.license, MAX_LICENSE)?;

    // Enforce basic policy
    if project.policy.content.max_blob_bytes > 0 {
        require!(args.artifact_bytes <= project.policy.content.max_blob_bytes, GitNutError::PolicyViolation);
    }

    let version = &mut ctx.accounts.version;
    let bump = *ctx.bumps.get("version").ok_or(GitNutError::InvalidPda)?;
    version.bump = bump;
    version.project = project.key();

    version.semver = args.semver.clone();
    version.repo_ref = args.repo_ref.clone();
    version.artifact_uri = args.artifact_uri.clone();
    version.content_hash = args.content_hash;
    version.license = args.license.clone();
    version.artifact_bytes = args.artifact_bytes;
    version.attestations = vec![];

    version.created_at = now_ts();
    version.updated_at = version.created_at;
    version.deprecated = false;

    project.version_count = project.version_count.saturating_add(1);
    project.updated_at = now_ts();

    emit!(VersionPublished{
        project: project.key(),
        version: version.key(),
        semver: version.semver.clone(),
        repo_ref: version.repo_ref.clone(),
        artifact_uri: version.artifact_uri.clone(),
        content_hash: version.content_hash,
        ts: version.created_at,
    });

    Ok(())
}
