export type SandboxLimits = {
  cpuSeconds: number;
  memoryMB: number;
  diskMB: number;
  timeoutMs: number;
};

export const DEFAULT_LIMITS: SandboxLimits = {
  cpuSeconds: 30,
  memoryMB: 1024,
  diskMB: 2048,
  timeoutMs: 10 * 60_000,
};
