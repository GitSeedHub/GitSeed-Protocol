import fs from 'node:fs';
import path from 'node:path';
import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';
import { generateManifest, writeManifest } from '../normalize/gitnut-manifest.js';
import { scanForForbiddenContent } from '../policy/content-policy.js';
import { LicensePolicy, evaluateLicense } from '../policy/license-policy.js';

const log = createLogger({ name: 'gitnut-job-normalize' });

export async function runNormalizeJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  const imp = store.getArtifact<any>('import');
  if (!imp) throw new Error('missing import artifact');

  const hits = scanForForbiddenContent(imp.projectDir);
  if (hits.length) {
    throw new Error(`forbidden content detected: ${JSON.stringify(hits.slice(0, 5))}`);
  }

  const manifest = generateManifest({
    projectName: env.input.projectName,
    repoUrl: env.input.repoUrl,
    ref: env.input.ref,
    commit: imp.commit,
    projectDir: imp.projectDir,
    subdir: env.input.subdir,
  });

  const normDir = path.join(imp.outDir, 'normalize');
  await fs.promises.mkdir(normDir, { recursive: true });
  const manifestPath = writeManifest(normDir, manifest);

  const policy: LicensePolicy = LicensePolicy.parse({}); // defaults
  const licenseOk = evaluateLicense(policy, manifest.license.spdxLike);
  if (!licenseOk) {
    throw new Error(`license policy rejected: ${manifest.license.spdxLike || 'unknown'}`);
  }

  store.putArtifact('normalize', {
    manifest,
    manifestPath,
    policy: { license: policy },
  });

  log.info({ projectId: env.projectId, runId: env.runId, stack: manifest.stack }, 'normalize complete');
}
