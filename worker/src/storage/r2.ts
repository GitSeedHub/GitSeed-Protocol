import { S3StorageDriver } from './s3.js';

/**
 * Cloudflare R2 is S3-compatible; treat as S3 with a different endpoint.
 */
export class R2StorageDriver extends S3StorageDriver {}
