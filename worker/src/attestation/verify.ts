import crypto from 'node:crypto';
import { canonicalJson, sha256Hex } from './canonicalize.js';

export function verifyEnvelope(env: { payload: any; payloadSha256: string; signature: string; publicKey: string }) {
  const canonical = canonicalJson(env.payload);
  const digest = sha256Hex(canonical);
  if (digest !== env.payloadSha256) return false;

  const publicKeyDer = Buffer.from(env.publicKey, 'base64');
  const publicKey = crypto.createPublicKey({ key: publicKeyDer, type: 'spki', format: 'der' });

  return crypto.verify(null, Buffer.from(canonical), publicKey, Buffer.from(env.signature, 'base64'));
}
