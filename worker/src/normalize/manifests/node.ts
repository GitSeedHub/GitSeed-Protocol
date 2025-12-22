import fs from 'node:fs';
import path from 'node:path';

export type NodeManifest = {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export function readNodeManifest(projectDir: string): NodeManifest | null {
  const p = path.join(projectDir, 'package.json');
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf-8');
  const j = JSON.parse(raw);
  return {
    name: j.name,
    version: j.version,
    scripts: j.scripts || {},
    dependencies: j.dependencies || {},
    devDependencies: j.devDependencies || {},
  };
}
