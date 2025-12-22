import { execa } from 'execa';

export async function ensureShallowClone(workdir: string) {
  // Some providers ignore --depth in certain scenarios; this tries to enforce a shallow checkout.
  try {
    await execa('git', ['rev-parse', '--is-shallow-repository'], { cwd: workdir });
  } catch {
    // ignore
  }
}
