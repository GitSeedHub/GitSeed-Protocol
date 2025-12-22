import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import { WorkerConfig } from '../bootstrap.js';
import { createLogger } from '../telemetry/logger.js';
import { runPipeline } from '../pipeline/pipeline.js';
import { JobEnvelopeSchema } from '../types/jobs.js';

const log = createLogger({ name: 'gitnut-worker-queue' });

export type GitNutQueues = {
  pipelineQueue: Queue;
  events: QueueEvents;
  close: () => Promise<void>;
};

export const PIPELINE_QUEUE_NAME = 'gitnut:pipeline';

export function createQueues(cfg: WorkerConfig): GitNutQueues {
  const connection = { url: cfg.env.REDIS_URL };

  const pipelineQueue = new Queue(PIPELINE_QUEUE_NAME, { connection });
  const events = new QueueEvents(PIPELINE_QUEUE_NAME, { connection });

  events.on('failed', ({ jobId, failedReason }) => {
    log.warn({ jobId, failedReason }, 'job failed');
  });
  events.on('completed', ({ jobId }) => {
    log.info({ jobId }, 'job completed');
  });

  return {
    pipelineQueue,
    events,
    close: async () => {
      await Promise.allSettled([pipelineQueue.close(), events.close()]);
    },
  };
}

export async function startWorkers(cfg: WorkerConfig, queues: GitNutQueues) {
  const connection = { url: cfg.env.REDIS_URL };

  const worker = new Worker(
    PIPELINE_QUEUE_NAME,
    async (job) => {
      const parsed = JobEnvelopeSchema.safeParse(job.data);
      if (!parsed.success) {
        throw new Error(`Invalid job payload: ${parsed.error.message}`);
      }
      const env = parsed.data;
      log.info({ jobId: job.id, type: env.type, projectId: env.projectId }, 'run pipeline');
      return await runPipeline(cfg, env, (p) => job.updateProgress(p));
    },
    {
      connection,
      concurrency: 2,
      lockDuration: 60_000,
    },
  );

  worker.on('error', (err) => log.error({ err }, 'worker error'));
  worker.on('failed', (job, err) => log.warn({ jobId: job?.id, err }, 'worker failed'));
  worker.on('completed', (job) => log.info({ jobId: job.id }, 'worker completed'));

  log.info('workers started');
}

export async function enqueuePipeline(queues: GitNutQueues, payload: unknown, opts?: JobsOptions) {
  return queues.pipelineQueue.add('pipeline', payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2_000 },
    removeOnComplete: { age: 3600, count: 2000 },
    removeOnFail: { age: 24 * 3600, count: 2000 },
    ...opts,
  });
}
