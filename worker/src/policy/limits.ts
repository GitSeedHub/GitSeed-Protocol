import { WorkerConfig } from '../bootstrap.js';

export function maxArchiveBytes(cfg: WorkerConfig) {
  return cfg.env.GITNUT_MAX_ARCHIVE_MB * 1024 * 1024;
}

export function maxRepoSizeBytes(cfg: WorkerConfig) {
  return cfg.env.GITNUT_MAX_REPO_SIZE_MB * 1024 * 1024;
}
