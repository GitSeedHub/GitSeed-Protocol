import type { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

export type WalletLike = {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
};

export function assertWallet(w?: WalletLike | null): WalletLike {
  if (!w) throw new Error('Wallet not connected');
  if (!w.publicKey) throw new Error('Wallet missing publicKey');
  if (!w.signTransaction) throw new Error('Wallet missing signTransaction');
  return w;
}
