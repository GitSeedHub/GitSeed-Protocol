import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import stableStringify from 'fast-json-stable-stringify';
import { detectStack, StackKind } from './detect-stack.js';
import { detectLicense } from './license.js';
import { readNodeManifest } from './manifests/node.js';
import { readPythonManifest } from './manifests/python.js';
import { readRustManifest } from './manifests/rust.js';
import { readStaticManifest } from './manifests/static.js';

export type GitNutManifest = {
  schema: 'gitnut.manifest.v1';
  createdAt: string;
  stack: StackKind;
  project: {
    name: string;
    repoUrl: string;
    ref?: string;
    commit: string;
    subdir?: string;
  };
  license: ReturnType<typeof detectLicense>;
  detected: {
    node?: ReturnType<typeof readNodeManifest>;
    python?: ReturnType<typeof readPythonManifest>;
    rust?: ReturnType<typeof readRustManifest>;
    static?: ReturnType<typeof readStaticManifest>;
  };
  digests: {
    canonicalJsonSha256: string;
  };
};

export function generateManifest(params: {
  projectName: string;
  repoUrl: string;
  ref?: string;
  commit: string;
  projectDir: string;
  subdir?: string;
}): GitNutManifest {
  const stack = detectStack(params.projectDir);
  const license = detectLicense(params.projectDir);

  const detected = {
    node: readNodeManifest(params.projectDir) || undefined,
    python: readPythonManifest(params.projectDir) || undefined,
    rust: readRustManifest(params.projectDir) || undefined,
    static: readStaticManifest(params.projectDir) || undefined,
  };

  const base: Omit<GitNutManifest, 'digests'> = {
    schema: 'gitnut.manifest.v1',
    createdAt: new Date().toISOString(),
    stack,
    project: {
      name: params.projectName,
      repoUrl: params.repoUrl,
      ref: params.ref,
      commit: params.commit,
      subdir: params.subdir,
    },
    license,
    detected,
  };

  const canonical = stableStringify(base);
  const canonicalJsonSha256 = crypto.createHash('sha256').update(canonical).digest('hex');

  return { ...base, digests: { canonicalJsonSha256 } };
}

export function writeManifest(outDir: string, manifest: GitNutManifest) {
  fs.mkdirSync(outDir, { recursive: true });
  const p = path.join(outDir, 'gitnut.json');
  fs.writeFileSync(p, JSON.stringify(manifest, null, 2));
  return p;
}
