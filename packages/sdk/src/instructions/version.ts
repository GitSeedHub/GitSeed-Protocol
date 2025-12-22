import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { deriveProjectPda, deriveRegistryPda, deriveVersionPda } from '../pda/derive.js';

export type PublishVersionArgs = {
  projectId: string;
  version: string;
  sourceHash: string;
  artifactHash: string;
  storageUri: string;
};

export async function buildPublishVersionIx(opts: {
  program: anchor.Program;
  payer: PublicKey;
  issuer: PublicKey;
  args: PublishVersionArgs;
}): Promise<anchor.web3.TransactionInstruction> {
  const programId = opts.program.programId;
  const { pda: registry } = await deriveRegistryPda(programId);
  const { pda: project } = await deriveProjectPda(programId, registry, opts.args.projectId);
  const { pda: version } = await deriveVersionPda(programId, project, opts.args.version);

  return opts.program.methods
    .publishVersion(opts.args.version, opts.args.sourceHash, opts.args.artifactHash, opts.args.storageUri)
    .accounts({
      payer: opts.payer,
      registry,
      project,
      version,
      issuer: opts.issuer,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

export type DeprecateVersionArgs = { projectId: string; version: string };

export async function buildDeprecateVersionIx(opts: {
  program: anchor.Program;
  authority: PublicKey;
  args: DeprecateVersionArgs;
}): Promise<anchor.web3.TransactionInstruction> {
  const programId = opts.program.programId;
  const { pda: registry } = await deriveRegistryPda(programId);
  const { pda: project } = await deriveProjectPda(programId, registry, opts.args.projectId);
  const { pda: version } = await deriveVersionPda(programId, project, opts.args.version);

  return opts.program.methods
    .deprecateVersion()
    .accounts({
      registry,
      project,
      version,
      authority: opts.authority,
    })
    .instruction();
}
