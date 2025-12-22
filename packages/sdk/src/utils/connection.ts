import { Connection, Commitment } from '@solana/web3.js';

export type ConnectionOptions = {
  endpoint: string;
  commitment?: Commitment;
};

export function createConnection(opts: ConnectionOptions): Connection {
  return new Connection(opts.endpoint, opts.commitment ?? 'confirmed');
}
