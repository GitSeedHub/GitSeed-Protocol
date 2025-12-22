use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;
use crate::state::policy::*;
use super::_helpers::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SetPolicyArgs {
    pub allow_any_license: bool,
    pub allowed_licenses: Vec<String>,
    pub max_blob_bytes: u32,
    pub enforce_tags: bool,
}

#[derive(Accounts)]
pub struct SetPolicy<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,
}

pub fn handler(ctx: Context<SetPolicy>, args: SetPolicyArgs) -> Result<()> {
    let project = &mut ctx.accounts.project;
    require!(!project.is_closed, GitNutError::NotClosable);

    require_authorized(&project.owner, &project.maintainers, &ctx.accounts.signer.key())?;

    if !args.allow_any_license {
        require!(args.allowed_licenses.len() > 0, GitNutError::InvalidInput);
    }
    require!(args.allowed_licenses.len() <= 16, GitNutError::InvalidInput);
    for lic in args.allowed_licenses.iter() {
        require_str_max(lic, MAX_LICENSE)?;
    }

    project.policy = ProjectPolicy {
        license: LicensePolicy {
            allow_any: args.allow_any_license,
            allowed: args.allowed_licenses,
        },
        content: ContentPolicy {
            max_blob_bytes: args.max_blob_bytes,
            enforce_tags: args.enforce_tags,
        },
    };

    project.updated_at = crate::constants::now_ts();

    emit!(PolicyUpdated {
        project: project.key(),
        by: ctx.accounts.signer.key(),
        ts: project.updated_at,
    });

    Ok(())
}
