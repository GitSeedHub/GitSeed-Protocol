import fs from 'node:fs';
import crypto from 'node:crypto';
import { StorageDriver, StoredObject } from './interfaces.js';

/**
 * This is a minimal S3-compatible uploader.
 * For production use, replace with AWS SDK v3 and proper retries / multipart uploads.
 */
export class S3StorageDriver implements StorageDriver {
  constructor(private cfg: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {}

  async putObject(params: { key: string; filePath: string; contentType?: string; meta?: Record<string, string> }): Promise<StoredObject> {
    const buf = await fs.promises.readFile(params.filePath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

    // Placeholder: return a computed URL.
    // Implement actual upload with AWS SDK in a hardened deployment.
    const url = `${this.cfg.endpoint.replace(/\/$/, '')}/${this.cfg.bucket}/${params.key}`;
    return { key: params.key, url, bytes: buf.byteLength, sha256, contentType: params.contentType, meta: params.meta };
  }
}
