import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import type { AnchorIdl } from '../types/idl.js';
import { DEFAULT_GITNUT_REGISTRY_PROGRAM_ID } from '../constants/program.js';

export type ProgramLoaderOptions = {
  connection: anchor.web3.Connection;
  wallet: anchor.Wallet;
  programId?: PublicKey;
  idl: AnchorIdl;
};

export function loadGitNutRegistryProgram(opts: ProgramLoaderOptions): anchor.Program {
  const provider = new anchor.AnchorProvider(opts.connection, opts.wallet, {
    commitment: 'confirmed',
  });

  // Anchor expects a compatible IDL shape.
  const programId = opts.programId ?? DEFAULT_GITNUT_REGISTRY_PROGRAM_ID;

  return new anchor.Program(opts.idl as any, programId, provider);
}
