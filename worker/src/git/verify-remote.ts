import { z } from 'zod';

const GithubLike = z.string().regex(/^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org)\//i);

export function verifyRemoteUrl(repoUrl: string) {
  // This is intentionally conservative.
  // A production deployment should support self-hosted git servers via allowlists.
  const ok = GithubLike.safeParse(repoUrl);
  if (!ok.success) {
    throw new Error('Unsupported git host. Allowed: github.com, gitlab.com, bitbucket.org');
  }
}
