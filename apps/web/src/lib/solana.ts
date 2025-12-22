import { PublicKey } from "@solana/web3.js";

export function shortPk(pk: string, left = 4, right = 4) {
  if (pk.length <= left + right + 2) return pk;
  return `${pk.slice(0, left)}…${pk.slice(pk.length - right)}`;
}

export function tryPublicKey(v: string): PublicKey | null {
  try {
    return new PublicKey(v);
  } catch {
    return null;
  }
}
