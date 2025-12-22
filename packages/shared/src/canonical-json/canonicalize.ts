import { stableStringify } from './stableStringify.js';
import { sha256Hex } from '../hashes/sha256.js';

/**
 * Canonical payload:
 * - stable JSON string
 * - deterministic SHA-256 hash
 */
export function canonicalizeToJson(value: unknown): { json: string; sha256: string } {
  const json = stableStringify(value);
  const sha256 = sha256Hex(json);
  return { json, sha256 };
}
