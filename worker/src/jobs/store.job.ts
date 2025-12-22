import path from 'node:path';
import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';
import { LocalStorageDriver } from '../storage/local.js';
import { S3StorageDriver } from '../storage/s3.js';
import { R2StorageDriver } from '../storage/r2.js';
import { ArweaveStorageDriver } from '../storage/arweave.js';
import { StorageDriver } from '../storage/interfaces.js';

const log = createLogger({ name: 'gitnut-job-store' });

function createDriver(cfg: WorkerConfig): StorageDriver {
  const d = cfg.env.GITNUT_STORAGE_DRIVER;
  if (d === 'local') return new LocalStorageDriver(cfg.env.GITNUT_STORAGE_LOCAL_DIR);

  if (d === 's3') {
    if (!cfg.env.S3_ENDPOINT || !cfg.env.S3_REGION || !cfg.env.S3_BUCKET || !cfg.env.S3_ACCESS_KEY_ID || !cfg.env.S3_SECRET_ACCESS_KEY) {
      throw new Error('missing S3 config');
    }
    return new S3StorageDriver({
      endpoint: cfg.env.S3_ENDPOINT,
      region: cfg.env.S3_REGION,
      bucket: cfg.env.S3_BUCKET,
      accessKeyId: cfg.env.S3_ACCESS_KEY_ID,
      secretAccessKey: cfg.env.S3_SECRET_ACCESS_KEY,
    });
  }

  if (d === 'r2') {
    if (!cfg.env.S3_ENDPOINT || !cfg.env.S3_REGION || !cfg.env.S3_BUCKET || !cfg.env.S3_ACCESS_KEY_ID || !cfg.env.S3_SECRET_ACCESS_KEY) {
      throw new Error('missing R2 config (use S3-compatible env vars)');
    }
    return new R2StorageDriver({
      endpoint: cfg.env.S3_ENDPOINT,
      region: cfg.env.S3_REGION,
      bucket: cfg.env.S3_BUCKET,
      accessKeyId: cfg.env.S3_ACCESS_KEY_ID,
      secretAccessKey: cfg.env.S3_SECRET_ACCESS_KEY,
    });
  }

  if (d === 'arweave') {
    return new ArweaveStorageDriver(cfg.env.ARWEAVE_GATEWAY || 'https://arweave.net');
  }

  throw new Error(`unknown storage driver: ${d}`);
}

export async function runStoreJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  const imp = store.getArtifact<any>('import');
  const norm = store.getArtifact<any>('normalize');
  const build = store.getArtifact<any>('build');
  if (!imp || !norm || !build) throw new Error('missing previous artifacts');

  const driver = createDriver(cfg);

  const keyBase = `${env.projectId}/${env.runId}`;
  const sourceObj = await driver.putObject({
    key: `${keyBase}/source.tar.gz`,
    filePath: imp.sourceArchive.archivePath,
    contentType: 'application/gzip',
  });

  const manifestObj = await driver.putObject({
    key: `${keyBase}/gitnut.json`,
    filePath: norm.manifestPath,
    contentType: 'application/json',
  });

  const artifactObj = await driver.putObject({
    key: `${keyBase}/artifact.tar.gz`,
    filePath: build.artifactTar.file,
    contentType: 'application/gzip',
  });

  store.putArtifact('store', { sourceObj, manifestObj, artifactObj });
  log.info({ projectId: env.projectId, runId: env.runId }, 'store complete');
}
