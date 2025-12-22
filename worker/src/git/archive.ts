import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execa } from 'execa';

export type ArchiveResult = {
  archivePath: string;
  sha256: string;
  bytes: number;
};

export async function archiveRepository(workdir: string, outDir: string): Promise<ArchiveResult> {
  await fs.promises.mkdir(outDir, { recursive: true });
  const archivePath = path.join(outDir, 'source.tar.gz');

  await execa('tar', ['-czf', archivePath, '.'], { cwd: workdir });

  const buf = await fs.promises.readFile(archivePath);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  return { archivePath, sha256, bytes: buf.byteLength };
}
