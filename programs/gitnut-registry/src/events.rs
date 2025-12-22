// Added events for indexers
use anchor_lang::prelude::*;
#[event]
pub struct ReleasePublished{pub project:Pubkey,pub version:u64}
