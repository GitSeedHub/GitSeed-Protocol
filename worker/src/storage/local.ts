import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { StorageDriver, StoredObject } from './interfaces.js';

export class LocalStorageDriver implements StorageDriver {
  constructor(private rootDir: string) {}

  async putObject(params: { key: string; filePath: string; contentType?: string; meta?: Record<string, string> }): Promise<StoredObject> {
    const dst = path.join(this.rootDir, params.key);
    await fs.promises.mkdir(path.dirname(dst), { recursive: true });
    const buf = await fs.promises.readFile(params.filePath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    await fs.promises.writeFile(dst, buf);
    return { key: params.key, url: `file://${dst}`, bytes: buf.byteLength, sha256, contentType: params.contentType, meta: params.meta };
  }
}
