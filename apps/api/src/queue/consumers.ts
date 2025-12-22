/**
 * Optional embedded worker consumer.
 * Many deployments run workers as a separate service (apps/worker). This consumer allows
 * running an all-in-one mode for local dev.
 */
import { createWorker, JobKind, GitNutJobPayload } from "./queue.js";
import { prisma } from "../db/index.js";
import { updateReleaseStatus } from "../services/release.service.js";

async function handler(kind: JobKind, payload: GitNutJobPayload) {
  // This is a placeholder pipeline to demonstrate job orchestration.
  // Real pipeline logic lives in apps/worker.
  const release = await prisma.release.findUnique({ where: { id: payload.releaseId } });
  if (!release) return;

  if (kind === "build") {
    await updateReleaseStatus(payload.releaseId, "BUILDING");
  }
  if (kind === "attest") {
    await updateReleaseStatus(payload.releaseId, "ATTESTING");
  }
  if (kind === "anchor") {
    await updateReleaseStatus(payload.releaseId, "ANCHORED");
  }
}

export function startEmbeddedConsumer() {
  return createWorker(handler);
}
