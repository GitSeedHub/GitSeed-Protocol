import fs from 'node:fs';
import path from 'node:path';

export type StackKind = 'node' | 'python' | 'rust' | 'static' | 'unknown';

function exists(p: string) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

export function detectStack(projectDir: string): StackKind {
  const pkg = path.join(projectDir, 'package.json');
  const py = path.join(projectDir, 'pyproject.toml');
  const req = path.join(projectDir, 'requirements.txt');
  const cargo = path.join(projectDir, 'Cargo.toml');

  if (exists(pkg)) return 'node';
  if (exists(py) || exists(req)) return 'python';
  if (exists(cargo)) return 'rust';

  const hasHtml = exists(path.join(projectDir, 'index.html'));
  if (hasHtml) return 'static';

  return 'unknown';
}
