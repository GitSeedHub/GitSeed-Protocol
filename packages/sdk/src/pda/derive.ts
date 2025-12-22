import { PublicKey } from '@solana/web3.js';
import {
  SEED_MAINTAINER,
  SEED_POLICY,
  SEED_PROJECT,
  SEED_REGISTRY,
  SEED_VERSION,
} from '../constants/seeds.js';
import { utf8ToBytes } from '../utils/encoding.js';

export type PdaDerivation = { pda: PublicKey; bump: number };

export async function deriveRegistryPda(programId: PublicKey): Promise<PdaDerivation> {
  return PublicKey.findProgramAddress([utf8ToBytes(SEED_REGISTRY)], programId).then(([pda, bump]) => ({
    pda,
    bump,
  }));
}

export async function deriveProjectPda(
  programId: PublicKey,
  registry: PublicKey,
  projectId: string,
): Promise<PdaDerivation> {
  return PublicKey.findProgramAddress(
    [utf8ToBytes(SEED_PROJECT), registry.toBytes(), utf8ToBytes(projectId)],
    programId,
  ).then(([pda, bump]) => ({ pda, bump }));
}

export async function deriveVersionPda(
  programId: PublicKey,
  project: PublicKey,
  version: string,
): Promise<PdaDerivation> {
  return PublicKey.findProgramAddress(
    [utf8ToBytes(SEED_VERSION), project.toBytes(), utf8ToBytes(version)],
    programId,
  ).then(([pda, bump]) => ({ pda, bump }));
}

export async function deriveMaintainerPda(
  programId: PublicKey,
  project: PublicKey,
  wallet: PublicKey,
): Promise<PdaDerivation> {
  return PublicKey.findProgramAddress(
    [utf8ToBytes(SEED_MAINTAINER), project.toBytes(), wallet.toBytes()],
    programId,
  ).then(([pda, bump]) => ({ pda, bump }));
}

export async function derivePolicyPda(programId: PublicKey, project: PublicKey): Promise<PdaDerivation> {
  return PublicKey.findProgramAddress([utf8ToBytes(SEED_POLICY), project.toBytes()], programId).then(
    ([pda, bump]) => ({ pda, bump }),
  );
}
