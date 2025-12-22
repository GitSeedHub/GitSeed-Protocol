import fs from 'node:fs';
import path from 'node:path';

export type LicenseInfo = {
  file?: string;
  spdxLike?: string;
  detected: boolean;
};

const LICENSE_FILES = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING', 'COPYING.txt'];

export function detectLicense(projectDir: string): LicenseInfo {
  for (const f of LICENSE_FILES) {
    const p = path.join(projectDir, f);
    if (fs.existsSync(p)) {
      const text = fs.readFileSync(p, 'utf-8');
      const spdx = guessSpdx(text);
      return { file: f, spdxLike: spdx, detected: true };
    }
  }
  return { detected: false };
}

function guessSpdx(text: string): string | undefined {
  const t = text.toLowerCase();
  if (t.includes('mit license')) return 'MIT';
  if (t.includes('apache license') && t.includes('version 2')) return 'Apache-2.0';
  if (t.includes('gnu general public license') && t.includes('version 3')) return 'GPL-3.0';
  if (t.includes('gnu general public license') && t.includes('version 2')) return 'GPL-2.0';
  if (t.includes('bsd license')) return 'BSD';
  return undefined;
}
