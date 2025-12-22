import { createHash } from 'node:crypto';

export function sha256Hex(input: Uint8Array | string): string {
  const h = createHash('sha256');
  if (typeof input === 'string') h.update(input, 'utf8');
  else h.update(Buffer.from(input));
  return h.digest('hex');
}

export function sha256Bytes(input: Uint8Array | string): Uint8Array {
  const h = createHash('sha256');
  if (typeof input === 'string') h.update(input, 'utf8');
  else h.update(Buffer.from(input));
  return new Uint8Array(h.digest());
}
