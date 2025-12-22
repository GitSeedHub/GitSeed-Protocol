import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { deriveRegistryPda } from '../pda/derive.js';

export type InitializeRegistryArgs = {
  authority: PublicKey;
  attestationSigner: PublicKey;
  paused?: boolean;
};

export async function buildInitializeRegistryIx(opts: {
  program: anchor.Program;
  payer: PublicKey;
  args: InitializeRegistryArgs;
}): Promise<anchor.web3.TransactionInstruction> {
  const programId = opts.program.programId;
  const { pda: registry } = await deriveRegistryPda(programId);

  // Anchor method name must match your on-chain instruction.
  return opts.program.methods
    .initialize(opts.args.authority, opts.args.attestationSigner, !!opts.args.paused)
    .accounts({
      payer: opts.payer,
      registry,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}
