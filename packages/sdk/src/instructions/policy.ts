import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { derivePolicyPda, deriveProjectPda, deriveRegistryPda } from '../pda/derive.js';

export type SetPolicyArgs = {
  projectId: string;
  allowUnverified: boolean;
  requireLicense: boolean;
  allowedLicenses: string[];
  maxArtifactBytes: bigint;
};

export async function buildSetPolicyIx(opts: {
  program: anchor.Program;
  payer: PublicKey;
  authority: PublicKey;
  args: SetPolicyArgs;
}): Promise<anchor.web3.TransactionInstruction> {
  const programId = opts.program.programId;
  const { pda: registry } = await deriveRegistryPda(programId);
  const { pda: project } = await deriveProjectPda(programId, registry, opts.args.projectId);
  const { pda: policy } = await derivePolicyPda(programId, project);

  return opts.program.methods
    .setPolicy(
      opts.args.allowUnverified,
      opts.args.requireLicense,
      opts.args.allowedLicenses,
      new anchor.BN(opts.args.maxArtifactBytes.toString()),
    )
    .accounts({
      payer: opts.payer,
      registry,
      project,
      policy,
      authority: opts.authority,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}
