/**
 * GitHub service placeholder.
 * In production:
 * - Validate repo URLs
 * - Fetch repo metadata (default branch, license, commit details)
 * - Optionally verify signatures / provenance
 */
export function normalizeRepoUrl(repoUrl: string) {
  // normalize git+https, strip trailing .git
  return repoUrl
    .replace(/^git\+/, "")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
}
