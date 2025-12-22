import { WorkerConfig } from '../bootstrap.js';

export function isHostAllowed(cfg: WorkerConfig, host: string) {
  const allow = cfg.allowedHosts();
  if (allow.length === 0) return false;
  return allow.includes(host.toLowerCase());
}
