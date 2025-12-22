/**
 * Stable JSON stringify:
 * - object keys are sorted lexicographically
 * - arrays are preserved in order
 * - undefined values are omitted (like JSON.stringify)
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(sortValue);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) {
      const v = obj[k];
      if (typeof v === 'undefined') continue;
      out[k] = sortValue(v);
    }
    return out;
  }
  return value;
}
