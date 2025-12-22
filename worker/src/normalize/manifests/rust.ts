import fs from 'node:fs';
import path from 'node:path';

export type RustManifest = {
  packageName?: string;
  version?: string;
  edition?: string;
};

export function readRustManifest(projectDir: string): RustManifest | null {
  const cargo = path.join(projectDir, 'Cargo.toml');
  if (!fs.existsSync(cargo)) return null;

  const txt = fs.readFileSync(cargo, 'utf-8');
  const nameMatch = txt.match(/^name\s*=\s*["'](.+?)["']/m);
  const versionMatch = txt.match(/^version\s*=\s*["'](.+?)["']/m);
  const editionMatch = txt.match(/^edition\s*=\s*["'](.+?)["']/m);
  return { packageName: nameMatch?.[1], version: versionMatch?.[1], edition: editionMatch?.[1] };
}
