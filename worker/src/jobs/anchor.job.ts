import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';
import { PublicKey } from '@solana/web3.js';
import { RegistryClient } from '../solana/registry.client.js';

const log = createLogger({ name: 'gitnut-job-anchor' });

export async function runAnchorJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  // Anchoring is optional.
  if (!cfg.env.GITNUT_REGISTRY_PROGRAM_ID || !cfg.env.GITNUT_WORKER_SIGNER_KEYPAIR) {
    log.warn('anchoring skipped (missing program id or signer keypair)');
    store.putArtifact('anchor', { skipped: true });
    return;
  }

  const imp = store.getArtifact<any>('import');
  const norm = store.getArtifact<any>('normalize');
  const build = store.getArtifact<any>('build');
  const attest = store.getArtifact<any>('attest');
  if (!imp || !norm || !build || !attest) throw new Error('missing previous artifacts');

  const client = new RegistryClient(
    cfg.env.SOLANA_RPC_URL,
    new PublicKey(cfg.env.GITNUT_REGISTRY_PROGRAM_ID),
    cfg.env.GITNUT_WORKER_SIGNER_KEYPAIR
  );

  const sig = await client.anchorVersion({
    projectId: env.projectId,
    version: imp.commit.slice(0, 12),
    sourceSha256: imp.sourceArchive.sha256,
    buildSha256: build.artifactTar.sha256,
    sbomSha256: attest.sbom.sha256,
    manifestSha256: norm.manifest.digests.canonicalJsonSha256,
  });

  store.putArtifact('anchor', { signature: sig });
  log.info({ signature: sig }, 'anchor complete');
}
