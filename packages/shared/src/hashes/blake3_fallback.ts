import { createHash } from 'node:crypto';

/**
 * BLAKE3 is not available in Node's standard crypto module.
 * This function uses sha256 as a fallback so the project remains dependency-light.
 *
 * If you need real BLAKE3, wire in `blake3` package at the app layer.
 */
export function blake3LikeHex(input: Uint8Array | string): string {
  const h = createHash('sha256'); // fallback
  if (typeof input === 'string') h.update(input, 'utf8');
  else h.update(Buffer.from(input));
  return h.digest('hex');
}
