import fs from 'node:fs';
import path from 'node:path';
import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';

const log = createLogger({ name: 'gitnut-job-cleanup' });

export async function runCleanupJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  const imp = store.getArtifact<any>('import');
  if (!imp) return;

  // Keep state & outputs; remove cloned repository to save space.
  try {
    const repoRoot = imp.workdir as string;
    if (repoRoot && repoRoot.includes(path.join('.gitnut-work', 'repos'))) {
      fs.rmSync(repoRoot, { recursive: true, force: true });
      log.info({ repoRoot }, 'removed repo workdir');
    }
  } catch (err) {
    log.warn({ err }, 'cleanup error ignored');
  }

  store.putArtifact('cleanup', { ok: true });
}
