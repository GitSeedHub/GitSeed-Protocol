import 'dotenv/config';
import { createLogger } from './telemetry/logger.js';
import { createQueues, startWorkers } from './queue/queue.js';
import { bootstrap } from './bootstrap.js';

const log = createLogger({ name: 'gitnut-worker' });

async function main() {
  const cfg = bootstrap();
  log.info({ cfg: cfg.publicConfig() }, 'boot');

  const queues = createQueues(cfg);
  await startWorkers(cfg, queues);

  log.info('worker started');
  process.on('SIGINT', async () => {
    log.warn('SIGINT received');
    await queues.close();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    log.warn('SIGTERM received');
    await queues.close();
    process.exit(0);
  });
}

main().catch((err) => {
  log.error({ err }, 'fatal');
  process.exit(1);
});
