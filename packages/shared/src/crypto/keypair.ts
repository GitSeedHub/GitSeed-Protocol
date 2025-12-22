import { randomBytes } from 'node:crypto';

export type Ed25519Keypair = {
  publicKey: Uint8Array;
  secretKey: Uint8Array; // 64 bytes (seed + public key) common representation
};

/**
 * Generates a random 32-byte seed.
 * Consumers may use this seed to create a chain-specific keypair elsewhere.
 */
export function generateSeed32(): Uint8Array {
  return randomBytes(32);
}

/**
 * Simple helper to encode keys for env/config storage.
 */
export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}

export function base64ToBytes(s: string): Uint8Array {
  return new Uint8Array(Buffer.from(s, 'base64'));
}
