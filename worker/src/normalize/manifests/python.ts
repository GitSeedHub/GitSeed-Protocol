import fs from 'node:fs';
import path from 'node:path';

export type PythonManifest = {
  pyproject?: boolean;
  requirements?: boolean;
  name?: string;
  version?: string;
  dependencies?: string[];
};

export function readPythonManifest(projectDir: string): PythonManifest | null {
  const pyproject = path.join(projectDir, 'pyproject.toml');
  const requirements = path.join(projectDir, 'requirements.txt');

  const hasPy = fs.existsSync(pyproject);
  const hasReq = fs.existsSync(requirements);
  if (!hasPy && !hasReq) return null;

  const deps: string[] = [];
  if (hasReq) {
    const lines = fs.readFileSync(requirements, 'utf-8').split(/\r?\n/);
    for (const l of lines) {
      const s = l.trim();
      if (!s || s.startsWith('#')) continue;
      deps.push(s);
    }
  }

  // Minimal pyproject parsing (production should use a TOML parser)
  let name: string | undefined;
  let version: string | undefined;
  if (hasPy) {
    const txt = fs.readFileSync(pyproject, 'utf-8');
    const nameMatch = txt.match(/^name\s*=\s*["'](.+?)["']/m);
    const versionMatch = txt.match(/^version\s*=\s*["'](.+?)["']/m);
    name = nameMatch?.[1];
    version = versionMatch?.[1];
  }

  return { pyproject: hasPy, requirements: hasReq, name, version, dependencies: deps };
}
