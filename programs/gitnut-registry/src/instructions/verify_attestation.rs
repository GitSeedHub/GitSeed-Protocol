use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::GitNutError;
use crate::events::*;
use crate::state::project::Project;
use crate::state::version::{Version, AttestationRecord, AttestationType};
use super::_helpers::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VerifyAttestationArgs {
    pub attestation_type: u8,
    pub attestation_hash: [u8; 32],
}

#[derive(Accounts)]
pub struct VerifyAttestation<'info> {
    #[account(mut)]
    pub verifier: Signer<'info>,

    #[account(
        seeds = [PROJECT_SEED, project.slug.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [VERSION_SEED, project.key().as_ref(), version.semver.as_bytes()],
        bump = version.bump
    )]
    pub version: Account<'info, Version>,
}

pub fn handler(ctx: Context<VerifyAttestation>, args: VerifyAttestationArgs) -> Result<()> {
    let project = &ctx.accounts.project;
    let version = &mut ctx.accounts.version;

    require!(!project.is_closed, GitNutError::NotClosable);
    require!(!version.deprecated, GitNutError::VersionDeprecated);

    // Authorization: maintainers/owner can record attestations.
    require_authorized(&project.owner, &project.maintainers, &ctx.accounts.verifier.key())?;

    // Validate type
    require!(AttestationType::from_u8(args.attestation_type).is_some(), GitNutError::InvalidInput);

    // Dedup + cap
    require!(!version.has_attestation(args.attestation_type, &args.attestation_hash), GitNutError::AttestationAlreadyExists);
    require!(version.attestations.len() < MAX_ATTESTATIONS_PER_VERSION, GitNutError::TooManyAttestations);

    let rec = AttestationRecord {
        attestation_type: args.attestation_type,
        hash: args.attestation_hash,
        verifier: ctx.accounts.verifier.key(),
        verified_at: crate::constants::now_ts(),
    };
    version.attestations.push(rec);
    version.updated_at = crate::constants::now_ts();

    emit!(AttestationVerified{
        project: project.key(),
        version: version.key(),
        by: ctx.accounts.verifier.key(),
        attestation_type: args.attestation_type,
        attestation_hash: args.attestation_hash,
        ts: version.updated_at,
    });

    Ok(())
}
