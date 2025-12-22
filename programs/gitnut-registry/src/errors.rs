use anchor_lang::prelude::*;

#[error_code]
pub enum GitNutError {
    #[msg("Unauthorized")]
    Unauthorized,

    #[msg("Invalid input")]
    InvalidInput,

    #[msg("Project already exists")]
    ProjectAlreadyExists,

    #[msg("Version already exists")]
    VersionAlreadyExists,

    #[msg("Version is deprecated")]
    VersionDeprecated,

    #[msg("Too many maintainers")]
    TooManyMaintainers,

    #[msg("Maintainers list cannot be empty")]
    EmptyMaintainers,

    #[msg("Policy violation")]
    PolicyViolation,

    #[msg("Attestation already recorded")]
    AttestationAlreadyExists,

    #[msg("Too many attestations")]
    TooManyAttestations,

    #[msg("String too long")]
    StringTooLong,

    #[msg("Invalid PDA seeds")]
    InvalidPda,

    #[msg("Account not closable")]
    NotClosable,
}
