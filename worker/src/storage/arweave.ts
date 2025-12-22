import fs from 'node:fs';
import crypto from 'node:crypto';
import { StorageDriver, StoredObject } from './interfaces.js';

/**
 * Minimal Arweave gateway placeholder.
 * A production implementation should:
 * - sign and submit transactions
 * - handle bundling (Bundlr/ArDrive)
 * - verify confirmations
 */
export class ArweaveStorageDriver implements StorageDriver {
  constructor(private gateway: string) {}

  async putObject(params: { key: string; filePath: string; contentType?: string; meta?: Record<string, string> }): Promise<StoredObject> {
    const buf = await fs.promises.readFile(params.filePath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    const url = `${this.gateway.replace(/\/$/, '')}/tx/${encodeURIComponent(params.key)}`;
    return { key: params.key, url, bytes: buf.byteLength, sha256, contentType: params.contentType, meta: params.meta };
  }
}
