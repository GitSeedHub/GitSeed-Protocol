/**
 * Minimal multihash-like wrapper for content-addressed identifiers.
 * Not a full multiformats implementation; keeps GitNut core lightweight.
 */

export type HashAlg = 'sha256' | 'blake3';

export type ContentHash = {
  alg: HashAlg;
  hex: string;
};

export function formatContentHash(h: ContentHash): string {
  return `${h.alg}:${h.hex}`;
}

export function parseContentHash(s: string): ContentHash {
  const [alg, hex] = s.split(':');
  if (alg !== 'sha256' && alg !== 'blake3') throw new Error(`Unsupported hash alg: ${alg}`);
  if (!hex || !/^[0-9a-f]+$/i.test(hex)) throw new Error('Invalid hash hex');
  return { alg, hex: hex.toLowerCase() };
}
