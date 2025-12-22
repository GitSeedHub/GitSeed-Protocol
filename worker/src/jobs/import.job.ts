import fs from 'node:fs';
import path from 'node:path';
import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';
import { cloneRepository } from '../git/clone.js';
import { archiveRepository } from '../git/archive.js';
import { maxArchiveBytes } from '../policy/limits.js';

const log = createLogger({ name: 'gitnut-job-import' });

export async function runImportJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  const clone = await cloneRepository(cfg, {
    repoUrl: env.input.repoUrl,
    ref: env.input.ref,
    commit: env.input.commit,
  });

  const projectDir = env.input.subdir ? path.join(clone.workdir, env.input.subdir) : clone.workdir;
  if (!fs.existsSync(projectDir)) {
    throw new Error(`subdir not found: ${env.input.subdir}`);
  }

  const outDir = path.resolve(process.cwd(), '.gitnut-work', 'runs', env.projectId, env.runId);
  await fs.promises.mkdir(outDir, { recursive: true });

  const arch = await archiveRepository(clone.workdir, path.join(outDir, 'import'));
  const limit = maxArchiveBytes(cfg);
  if (arch.bytes > limit) throw new Error(`archive too large: ${arch.bytes} > ${limit}`);

  store.putArtifact('import', {
    repoUrl: clone.repoUrl,
    ref: clone.ref,
    commit: clone.commit,
    workdir: clone.workdir,
    projectDir,
    outDir,
    sourceArchive: arch,
  });

  log.info({ projectId: env.projectId, runId: env.runId, commit: clone.commit }, 'import complete');
}
