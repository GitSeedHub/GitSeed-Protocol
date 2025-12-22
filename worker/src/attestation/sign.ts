import crypto from 'node:crypto';
import { canonicalJson, sha256Hex } from './canonicalize.js';

export type Signer = {
  publicKeyPem: string;
  privateKeyPem: string;
};

export function generateSigner(): Signer {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  return {
    publicKeyPem: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
    privateKeyPem: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  };
}

export function signPayload(signer: Signer, payload: any) {
  const canonical = canonicalJson(payload);
  const payloadSha256 = sha256Hex(canonical);

  const signature = crypto.sign(null, Buffer.from(canonical), signer.privateKeyPem);
  const publicKeyDer = crypto.createPublicKey(signer.publicKeyPem).export({ type: 'spki', format: 'der' });

  return {
    schema: 'gitnut.signed-envelope.v1' as const,
    payload,
    payloadSha256,
    signature: signature.toString('base64'),
    publicKey: Buffer.from(publicKeyDer).toString('base64'),
    createdAt: new Date().toISOString(),
  };
}
