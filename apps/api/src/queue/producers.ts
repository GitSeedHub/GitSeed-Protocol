import { enqueue } from "./queue.js";

export async function enqueueReleasePipeline(releaseId: string) {
  // In production you would enforce ordering and idempotency.
  await enqueue("import", { releaseId });
  await enqueue("normalize", { releaseId });
  await enqueue("build", { releaseId });
  await enqueue("store", { releaseId });
  await enqueue("attest", { releaseId });
  await enqueue("anchor", { releaseId });
}
