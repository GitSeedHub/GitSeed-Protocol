import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env.js";
import { prisma } from "../db/index.js";

export type JobKind = "import" | "normalize" | "build" | "store" | "attest" | "anchor";

export type GitNutJobPayload = {
  releaseId: string;
  projectId?: string;
  repoUrl?: string;
  version?: string;
  commitSha?: string;
};

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const gitnutQueue = new Queue<GitNutJobPayload>("gitnut", { connection });
export const gitnutEvents = new QueueEvents("gitnut", { connection });

export const defaultJobOpts: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 1000 },
  removeOnComplete: 1000,
  removeOnFail: 1000,
};

export async function enqueue(kind: JobKind, payload: GitNutJobPayload) {
  await prisma.jobRun.create({
    data: {
      releaseId: payload.releaseId,
      kind,
      status: "queued",
      message: "enqueued",
    },
  });
  return gitnutQueue.add(kind, payload, defaultJobOpts);
}

export function createWorker(handler: (kind: JobKind, payload: GitNutJobPayload) => Promise<void>) {
  const w = new Worker<GitNutJobPayload>(
    "gitnut",
    async (job) => {
      const kind = job.name as JobKind;
      await prisma.jobRun.updateMany({
        where: { releaseId: job.data.releaseId, kind, status: "queued" },
        data: { status: "active", message: `job ${job.id} active` },
      });

      try {
        await handler(kind, job.data);
        await prisma.jobRun.updateMany({
          where: { releaseId: job.data.releaseId, kind, status: "active" },
          data: { status: "completed", message: `job ${job.id} completed` },
        });
      } catch (e) {
        await prisma.jobRun.updateMany({
          where: { releaseId: job.data.releaseId, kind, status: "active" },
          data: { status: "failed", message: e instanceof Error ? e.message : String(e) },
        });
        throw e;
      }
    },
    { connection, concurrency: env.JOB_CONCURRENCY }
  );

  return w;
}
