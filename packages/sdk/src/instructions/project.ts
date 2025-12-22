import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { deriveProjectPda, deriveRegistryPda } from '../pda/derive.js';

export type RegisterProjectArgs = {
  projectId: string;
  repoUrl: string;
};

export async function buildRegisterProjectIx(opts: {
  program: anchor.Program;
  payer: PublicKey;
  owner: PublicKey;
  args: RegisterProjectArgs;
}): Promise<anchor.web3.TransactionInstruction> {
  const programId = opts.program.programId;
  const { pda: registry } = await deriveRegistryPda(programId);
  const { pda: project } = await deriveProjectPda(programId, registry, opts.args.projectId);

  return opts.program.methods
    .registerProject(opts.args.projectId, opts.args.repoUrl)
    .accounts({
      payer: opts.payer,
      registry,
      project,
      owner: opts.owner,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

export type TransferProjectArgs = { newOwner: PublicKey; projectId: string };

export async function buildTransferProjectIx(opts: {
  program: anchor.Program;
  authority: PublicKey;
  args: TransferProjectArgs;
}): Promise<anchor.web3.TransactionInstruction> {
  const { pda: registry } = await deriveRegistryPda(opts.program.programId);
  const { pda: project } = await deriveProjectPda(opts.program.programId, registry, opts.args.projectId);

  return opts.program.methods
    .transferProject(opts.args.newOwner)
    .accounts({
      registry,
      project,
      authority: opts.authority,
    })
    .instruction();
}
