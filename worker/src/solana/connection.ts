import { Connection, Commitment } from '@solana/web3.js';

export function createConnection(rpcUrl: string, commitment: Commitment = 'confirmed') {
  return new Connection(rpcUrl, { commitment });
}
