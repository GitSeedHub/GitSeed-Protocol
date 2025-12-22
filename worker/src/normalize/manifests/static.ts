import fs from 'node:fs';
import path from 'node:path';

export type StaticManifest = {
  entry?: string;
  files: string[];
};

export function readStaticManifest(projectDir: string): StaticManifest | null {
  const entry = path.join(projectDir, 'index.html');
  if (!fs.existsSync(entry)) return null;

  const files: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(path.relative(projectDir, p));
    }
  };
  walk(projectDir);

  return { entry: 'index.html', files };
}
