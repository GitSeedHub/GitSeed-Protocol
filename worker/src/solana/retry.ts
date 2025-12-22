import pRetry from 'p-retry';

export async function withRetry<T>(fn: () => Promise<T>, opts?: { retries?: number; minTimeout?: number }) {
  return pRetry(fn, { retries: opts?.retries ?? 5, minTimeout: opts?.minTimeout ?? 800 });
}
