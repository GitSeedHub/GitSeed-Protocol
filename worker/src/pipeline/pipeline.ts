import { WorkerConfig } from '../bootstrap.js';
import { createLogger } from '../telemetry/logger.js';
import { JobEnvelope } from '../types/jobs.js';
import { runImportJob } from '../jobs/import.job.js';
import { runNormalizeJob } from '../jobs/normalize.job.js';
import { runBuildJob } from '../jobs/build.job.js';
import { runStoreJob } from '../jobs/store.job.js';
import { runAttestJob } from '../jobs/attest.job.js';
import { runAnchorJob } from '../jobs/anchor.job.js';
import { runCleanupJob } from '../jobs/cleanup.job.js';
import { PipelineStateStore } from './state-machine.js';
import { withIdempotency } from './idempotency.js';

const log = createLogger({ name: 'gitnut-pipeline' });

export type ProgressFn = (p: number | object) => Promise<void> | void;

export async function runPipeline(cfg: WorkerConfig, env: JobEnvelope, progress?: ProgressFn) {
  const store = new PipelineStateStore(env.projectId, env.runId);

  const step = async (name: string, percent: number, fn: () => Promise<void>) => {
    log.info({ projectId: env.projectId, runId: env.runId, step: name }, 'step start');
    await progress?.({ step: name, percent });
    await fn();
    await progress?.({ step: name, percent: percent + 5 });
    log.info({ projectId: env.projectId, runId: env.runId, step: name }, 'step done');
  };

  await step('import', 5, async () =>
    withIdempotency(store, 'import', async () => runImportJob(cfg, env, store))
  );
  await step('normalize', 15, async () =>
    withIdempotency(store, 'normalize', async () => runNormalizeJob(cfg, env, store))
  );
  await step('build', 30, async () =>
    withIdempotency(store, 'build', async () => runBuildJob(cfg, env, store))
  );
  await step('store', 55, async () =>
    withIdempotency(store, 'store', async () => runStoreJob(cfg, env, store))
  );
  await step('attest', 70, async () =>
    withIdempotency(store, 'attest', async () => runAttestJob(cfg, env, store))
  );
  await step('anchor', 85, async () =>
    withIdempotency(store, 'anchor', async () => runAnchorJob(cfg, env, store))
  );
  await step('cleanup', 95, async () =>
    withIdempotency(store, 'cleanup', async () => runCleanupJob(cfg, env, store))
  );

  await store.markComplete();
  await progress?.({ step: 'done', percent: 100 });

  return store.snapshot();
}
