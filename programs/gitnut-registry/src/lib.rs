use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod state;
pub mod instructions;

use instructions::*;

declare_id!("GiTNuTReg1stry11111111111111111111111111111");

#[program]
pub mod gitnut_registry {
    use super::*;

    pub fn initialize(ctx: Context<initialize::Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    pub fn register_project(ctx: Context<register_project::RegisterProject>, args: register_project::RegisterProjectArgs) -> Result<()> {
        register_project::handler(ctx, args)
    }

    pub fn publish_version(ctx: Context<publish_version::PublishVersion>, args: publish_version::PublishVersionArgs) -> Result<()> {
        publish_version::handler(ctx, args)
    }

    pub fn set_maintainers(ctx: Context<set_maintainers::SetMaintainers>, args: set_maintainers::SetMaintainersArgs) -> Result<()> {
        set_maintainers::handler(ctx, args)
    }

    pub fn set_policy(ctx: Context<set_policy::SetPolicy>, args: set_policy::SetPolicyArgs) -> Result<()> {
        set_policy::handler(ctx, args)
    }

    pub fn verify_attestation(ctx: Context<verify_attestation::VerifyAttestation>, args: verify_attestation::VerifyAttestationArgs) -> Result<()> {
        verify_attestation::handler(ctx, args)
    }

    pub fn deprecate_version(ctx: Context<deprecate_version::DeprecateVersion>) -> Result<()> {
        deprecate_version::handler(ctx)
    }

    pub fn transfer_project(ctx: Context<transfer_project::TransferProject>, args: transfer_project::TransferProjectArgs) -> Result<()> {
        transfer_project::handler(ctx, args)
    }

    pub fn close_project(ctx: Context<close_project::CloseProject>) -> Result<()> {
        close_project::handler(ctx)
    }
}
