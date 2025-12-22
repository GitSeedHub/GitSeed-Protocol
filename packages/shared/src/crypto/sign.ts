import { createHash } from 'node:crypto';

/**
 * NOTE:
 * This is intentionally generic. For Solana ed25519 signatures,
 * prefer @solana/web3.js Keypair.sign or tweetnacl.
 *
 * This helper signs by hashing and returning the digest. It is useful for
 * deterministic fingerprints, not for authentication.
 */
export function digestSha256(data: Uint8Array | string): Uint8Array {
  const h = createHash('sha256');
  if (typeof data === 'string') h.update(data, 'utf8');
  else h.update(Buffer.from(data));
  return new Uint8Array(h.digest());
}
