import fs from 'node:fs';
import path from 'node:path';
import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';
import { generateSbom } from '../attestation/sbom.js';
import { signPayload, generateSigner } from '../attestation/sign.js';
import { SourceAttestationV1, BuildAttestationV1 } from '../attestation/schemas.js';

const log = createLogger({ name: 'gitnut-job-attest' });

export async function runAttestJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  const imp = store.getArtifact<any>('import');
  const norm = store.getArtifact<any>('normalize');
  const build = store.getArtifact<any>('build');
  const st = store.getArtifact<any>('store');
  if (!imp || !norm || !build || !st) throw new Error('missing previous artifacts');

  const attestDir = path.join(imp.outDir, 'attest');
  await fs.promises.mkdir(attestDir, { recursive: true });

  const sbom = await generateSbom(attestDir, { kind: build.kind, dependencies: norm.manifest.detected });

  const sourceAtt = SourceAttestationV1.parse({
    schema: 'gitnut.attestation.source.v1',
    projectId: env.projectId,
    runId: env.runId,
    repoUrl: env.input.repoUrl,
    ref: env.input.ref,
    commit: imp.commit,
    source: {
      archiveSha256: imp.sourceArchive.sha256,
      archiveBytes: imp.sourceArchive.bytes,
    },
    manifest: {
      canonicalJsonSha256: norm.manifest.digests.canonicalJsonSha256,
    },
    createdAt: new Date().toISOString(),
  });

  const buildAtt = BuildAttestationV1.parse({
    schema: 'gitnut.attestation.build.v1',
    projectId: env.projectId,
    runId: env.runId,
    build: {
      kind: build.kind,
      artifactSha256: build.artifactTar.sha256,
      artifactBytes: build.artifactTar.bytes,
    },
    sbom: {
      sbomSha256: sbom.sha256,
      sbomBytes: sbom.bytes,
    },
    createdAt: new Date().toISOString(),
  });

  const signer = generateSigner();
  const sourceEnv = signPayload(signer, sourceAtt);
  const buildEnv = signPayload(signer, buildAtt);

  const sourcePath = path.join(attestDir, 'source.attestation.json');
  const buildPath = path.join(attestDir, 'build.attestation.json');
  const signerPath = path.join(attestDir, 'signer.public.pem');

  await fs.promises.writeFile(sourcePath, JSON.stringify(sourceEnv, null, 2));
  await fs.promises.writeFile(buildPath, JSON.stringify(buildEnv, null, 2));
  await fs.promises.writeFile(signerPath, signer.publicKeyPem);

  store.putArtifact('attest', {
    sbom,
    sourceEnvelope: { path: sourcePath, payloadSha256: sourceEnv.payloadSha256 },
    buildEnvelope: { path: buildPath, payloadSha256: buildEnv.payloadSha256 },
    publicKeyPemPath: signerPath,
  });

  log.info({ projectId: env.projectId, runId: env.runId }, 'attest complete');
}
