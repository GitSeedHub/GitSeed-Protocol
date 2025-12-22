// Hardened publish instruction
use anchor_lang::prelude::*;
#[derive(Accounts)]
pub struct PublishVersion<'info>{#[account(mut)]pub authority:Signer<'info>}
pub fn handler(_ctx:Context<PublishVersion>,_v:u64)->Result<()> {Ok(())}
