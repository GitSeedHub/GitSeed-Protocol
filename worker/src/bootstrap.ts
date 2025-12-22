import { z } from 'zod';
import { createLogger } from './telemetry/logger.js';

const EnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  REDIS_URL: z.string().min(1),
  GITNUT_API_BASE_URL: z.string().optional(),
  GITNUT_API_TOKEN: z.string().optional(),

  // Storage
  GITNUT_STORAGE_DRIVER: z.enum(['local', 's3', 'r2', 'arweave']).default('local'),
  GITNUT_STORAGE_LOCAL_DIR: z.string().default('.gitnut-storage'),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  ARWEAVE_GATEWAY: z.string().optional(),

  // Execution & policy
  GITNUT_MAX_REPO_SIZE_MB: z.coerce.number().int().positive().default(200),
  GITNUT_MAX_ARCHIVE_MB: z.coerce.number().int().positive().default(100),
  GITNUT_ALLOW_NETWORK: z.coerce.boolean().default(false),
  GITNUT_ALLOWED_HOSTS: z.string().optional(),

  // Solana
  SOLANA_RPC_URL: z.string().default('http://127.0.0.1:8899'),
  GITNUT_REGISTRY_PROGRAM_ID: z.string().optional(),
  GITNUT_WORKER_SIGNER_KEYPAIR: z.string().optional(), // path to json keypair
});

export class WorkerConfig {
  constructor(readonly env: z.infer<typeof EnvSchema>) {}

  publicConfig() {
    const { GITNUT_API_TOKEN, S3_SECRET_ACCESS_KEY, R2_SECRET_ACCESS_KEY, ...safe } = this.env as any;
    return safe;
  }

  allowedHosts(): string[] {
    const raw = this.env.GITNUT_ALLOWED_HOSTS?.trim();
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
}

export function bootstrap(): WorkerConfig {
  const log = createLogger({ name: 'gitnut-worker-bootstrap' });
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    log.error({ issues: parsed.error.issues }, 'invalid environment');
    throw new Error('Invalid environment');
  }
  return new WorkerConfig(parsed.data);
}
