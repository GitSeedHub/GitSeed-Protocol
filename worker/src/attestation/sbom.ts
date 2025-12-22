import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type SbomResult = {
  path: string;
  sha256: string;
  bytes: number;
};

/**
 * Very lightweight SBOM generator.
 * Production deployments should generate SPDX or CycloneDX with full dependency graphs.
 */
export async function generateSbom(outDir: string, info: { kind: string; dependencies?: any }) : Promise<SbomResult> {
  await fs.promises.mkdir(outDir, { recursive: true });
  const p = path.join(outDir, 'sbom.json');
  const doc = {
    schema: 'gitnut.sbom.v1',
    createdAt: new Date().toISOString(),
    kind: info.kind,
    dependencies: info.dependencies || null,
  };
  const buf = Buffer.from(JSON.stringify(doc, null, 2));
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  await fs.promises.writeFile(p, buf);
  return { path: p, sha256, bytes: buf.byteLength };
}
