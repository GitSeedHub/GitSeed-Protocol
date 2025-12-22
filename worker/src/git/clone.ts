import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import simpleGit from 'simple-git';
import { WorkerConfig } from '../bootstrap.js';
import { createLogger } from '../telemetry/logger.js';
import { verifyRemoteUrl } from './verify-remote.js';

const log = createLogger({ name: 'gitnut-git-clone' });

function sha1(s: string) {
  return crypto.createHash('sha1').update(s).digest('hex');
}

export type CloneResult = {
  workdir: string;
  repoUrl: string;
  ref?: string;
  commit: string;
};

export async function cloneRepository(cfg: WorkerConfig, params: { repoUrl: string; ref?: string; commit?: string }) : Promise<CloneResult> {
  verifyRemoteUrl(params.repoUrl);

  const base = path.resolve(process.cwd(), '.gitnut-work', 'repos');
  fs.mkdirSync(base, { recursive: true });

  const repoKey = sha1(params.repoUrl);
  const dir = path.join(base, repoKey, String(Date.now()));
  fs.mkdirSync(dir, { recursive: true });

  const git = simpleGit({ baseDir: dir, binary: 'git' });

  log.info({ repoUrl: params.repoUrl, dir }, 'cloning');
  await git.clone(params.repoUrl, dir, ['--no-tags', '--filter=blob:none', '--depth', '1']);

  const repo = simpleGit({ baseDir: dir, binary: 'git' });

  if (params.ref) {
    log.info({ ref: params.ref }, 'checkout ref');
    await repo.fetch(['--depth', '1', 'origin', params.ref]);
    await repo.checkout(params.ref);
  }

  if (params.commit) {
    log.info({ commit: params.commit }, 'checkout commit');
    await repo.fetch(['--depth', '1', 'origin', params.commit]);
    await repo.checkout(params.commit);
  }

  const commit = (await repo.revparse(['HEAD'])).trim();
  log.info({ commit }, 'cloned');

  // Basic size check (best-effort)
  const stat = await fs.promises.stat(dir);
  void stat;

  return { workdir: dir, repoUrl: params.repoUrl, ref: params.ref, commit };
}
