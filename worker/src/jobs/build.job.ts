import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import tar from 'tar';
import { WorkerConfig } from '../bootstrap.js';
import { JobEnvelope } from '../types/jobs.js';
import { PipelineStateStore } from '../pipeline/state-machine.js';
import { createLogger } from '../telemetry/logger.js';
import { NodeBuilder } from '../builders/node.builder.js';
import { PythonBuilder } from '../builders/python.builder.js';
import { RustBuilder } from '../builders/rust.builder.js';
import { StaticBuilder } from '../builders/static.builder.js';

const log = createLogger({ name: 'gitnut-job-build' });

async function tarDir(dir: string, outFile: string) {
  await fs.promises.mkdir(path.dirname(outFile), { recursive: true });
  await tar.c({ gzip: true, file: outFile, cwd: dir }, ['.']);
  const buf = await fs.promises.readFile(outFile);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  return { file: outFile, bytes: buf.byteLength, sha256 };
}

export async function runBuildJob(cfg: WorkerConfig, env: JobEnvelope, store: PipelineStateStore) {
  const imp = store.getArtifact<any>('import');
  const norm = store.getArtifact<any>('normalize');
  if (!imp || !norm) throw new Error('missing previous artifacts');

  const outDir = imp.outDir as string;
  const buildDir = path.join(outDir, 'build');
  await fs.promises.mkdir(buildDir, { recursive: true });

  const stack = norm.manifest.stack as string;
  const allowNetwork = Boolean(cfg.env.GITNUT_ALLOW_NETWORK);

  const builders = {
    node: new NodeBuilder(),
    python: new PythonBuilder(),
    rust: new RustBuilder(),
    static: new StaticBuilder(),
  } as const;

  const builder = (builders as any)[stack] || builders.static;
  const buildOut = await builder.build({
    projectDir: imp.projectDir,
    outDir: buildDir,
    allowNetwork,
    env: {},
  });

  const artifactTar = await tarDir(buildOut.artifactDir, path.join(buildDir, 'artifact.tar.gz'));

  store.putArtifact('build', {
    kind: buildOut.kind,
    artifactDir: buildOut.artifactDir,
    artifactTar,
    logs: buildOut.logs,
  });

  log.info({ projectId: env.projectId, runId: env.runId, kind: buildOut.kind }, 'build complete');
}
