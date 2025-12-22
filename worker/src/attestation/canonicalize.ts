import stableStringify from 'fast-json-stable-stringify';
import crypto from 'node:crypto';

export function canonicalJson(obj: any) {
  return stableStringify(obj);
}

export function sha256Hex(data: string | Buffer) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
