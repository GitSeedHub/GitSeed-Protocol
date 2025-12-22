export type RetryOptions = {
  retries: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  jitter?: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions): Promise<T> {
  const retries = Math.max(0, opts.retries);
  const minDelay = opts.minDelayMs ?? 250;
  const maxDelay = opts.maxDelayMs ?? 5_000;
  const factor = opts.factor ?? 2;
  const jitter = opts.jitter ?? 0.2;

  let attempt = 0;
  let lastErr: unknown;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt === retries) break;
      const baseDelay = Math.min(maxDelay, minDelay * Math.pow(factor, attempt));
      const rand = 1 + (Math.random() * 2 - 1) * jitter;
      await sleep(Math.max(0, Math.floor(baseDelay * rand)));
      attempt++;
    }
  }

  throw lastErr;
}
