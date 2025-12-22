import fs from 'node:fs';
import { Keypair, Transaction, VersionedTransaction, Connection, sendAndConfirmTransaction } from '@solana/web3.js';

export function loadKeypairFromFile(pathStr: string): Keypair {
  const raw = fs.readFileSync(pathStr, 'utf-8');
  const secret = Uint8Array.from(JSON.parse(raw));
  return Keypair.fromSecretKey(secret);
}

export async function sendTx(connection: Connection, payer: Keypair, tx: Transaction) {
  return sendAndConfirmTransaction(connection, tx, [payer], { commitment: 'confirmed' });
}

export async function sendVtx(connection: Connection, vtx: VersionedTransaction) {
  const sig = await connection.sendTransaction(vtx, { skipPreflight: false, maxRetries: 3 });
  await connection.confirmTransaction(sig, 'confirmed');
  return sig;
}
