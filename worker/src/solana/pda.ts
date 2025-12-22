import { PublicKey } from '@solana/web3.js';

export function deriveProjectPda(programId: PublicKey, projectId: string) {
  return PublicKey.findProgramAddressSync([Buffer.from('project'), Buffer.from(projectId)], programId);
}

export function deriveVersionPda(programId: PublicKey, projectId: string, version: string) {
  return PublicKey.findProgramAddressSync([Buffer.from('version'), Buffer.from(projectId), Buffer.from(version)], programId);
}
