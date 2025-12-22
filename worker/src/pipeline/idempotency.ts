import { PipelineStateStore } from './state-machine.js';

export async function withIdempotency(store: PipelineStateStore, step: string, fn: () => Promise<void>) {
  const snapshot = store.snapshot();
  const existing = snapshot.steps[step];
  if (existing?.status === 'DONE') return;

  try {
    store.stepStart(step);
    await fn();
    store.stepDone(step);
  } catch (err) {
    store.stepFail(step, err);
    throw err;
  }
}
