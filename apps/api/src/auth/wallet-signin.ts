import nacl from "tweetnacl";

export function verifySolanaSignature(opts: {
  address: string;
  message: string;
  signatureBase64: string;
}) {
  const { address, message, signatureBase64 } = opts;

  // Avoid pulling in @solana/web3.js inside API core; treat address as base58 bytes.
  // This is a minimal verifier; in production use @solana/web3.js PublicKey for strict parsing.
  // Base58 decode implementation included below.
  const pubkey = base58Decode(address);
  const sig = Buffer.from(signatureBase64, "base64");
  const msg = Buffer.from(message, "utf8");

  if (pubkey.length !== 32) return false;
  if (sig.length !== 64) return false;

  return nacl.sign.detached.verify(msg, new Uint8Array(sig), new Uint8Array(pubkey));
}

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE = BigInt(58);

function base58Decode(input: string): Uint8Array {
  let num = BigInt(0);
  for (const c of input) {
    const p = ALPHABET.indexOf(c);
    if (p < 0) throw new Error("Invalid base58");
    num = num * BASE + BigInt(p);
  }
  const bytes: number[] = [];
  while (num > 0) {
    bytes.push(Number(num % BigInt(256)));
    num = num / BigInt(256);
  }
  bytes.reverse();
  // handle leading zeros
  let leading = 0;
  for (const c of input) {
    if (c === "1") leading++;
    else break;
  }
  const out = new Uint8Array(leading + bytes.length);
  out.set(bytes, leading);
  return out;
}
