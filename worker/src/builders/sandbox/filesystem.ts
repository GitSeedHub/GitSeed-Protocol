import fs from 'node:fs';
import path from 'node:path';

export function ensureCleanDir(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

export function copyDir(src: string, dst: string, ignore: (p: string) => boolean = () => false) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sp = path.join(src, entry.name);
    const rel = path.relative(src, sp);
    if (ignore(rel)) continue;

    const dp = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(sp, dp, ignore);
    else if (entry.isSymbolicLink()) {
      const link = fs.readlinkSync(sp);
      fs.symlinkSync(link, dp);
    } else {
      fs.copyFileSync(sp, dp);
    }
  }
}
