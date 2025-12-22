import { execa } from 'execa';
import path from 'node:path';
import fs from 'node:fs';
import { SandboxLimits, DEFAULT_LIMITS } from './limits.js';
import { networkAllowedFlag } from './network.js';

export type SandboxRun = {
  command: string[];
  cwd: string;
  env?: Record<string, string>;
  allowNetwork: boolean;
  image?: string; // if set, run inside docker
  limits?: Partial<SandboxLimits>;
  captureLogFile?: string;
};

export async function runInSandbox(run: SandboxRun) {
  const limits: SandboxLimits = { ...DEFAULT_LIMITS, ...(run.limits || {}) };

  if (run.image) {
    // Container execution (recommended for untrusted builds)
    const args: string[] = [
      'run',
      '--rm',
      ...networkAllowedFlag(run.allowNetwork),
      '-v', `${run.cwd}:/workspace`,
      '-w', '/workspace',
      '--memory', `${limits.memoryMB}m`,
      '--cpus', '1',
      run.image,
      ...run.command,
    ];

    const p = await execa('docker', args, {
      timeout: limits.timeoutMs,
      env: { ...process.env, ...(run.env || {}) },
      all: true,
      reject: false,
    });

    if (run.captureLogFile) {
      fs.mkdirSync(path.dirname(run.captureLogFile), { recursive: true });
      fs.writeFileSync(run.captureLogFile, p.all || '');
    }

    if (p.exitCode !== 0) {
      throw new Error(`Sandbox (docker) failed: ${p.exitCode}\n${p.all}`);
    }
    return { output: p.all || '' };
  }

  // Host execution fallback (development only)
  const p = await execa(run.command[0], run.command.slice(1), {
    cwd: run.cwd,
    timeout: limits.timeoutMs,
    env: { ...process.env, ...(run.env || {}) },
    all: true,
    reject: false,
  });

  if (run.captureLogFile) {
    fs.mkdirSync(path.dirname(run.captureLogFile), { recursive: true });
    fs.writeFileSync(run.captureLogFile, p.all || '');
  }

  if (p.exitCode !== 0) {
    throw new Error(`Sandbox (host) failed: ${p.exitCode}\n${p.all}`);
  }
  return { output: p.all || '' };
}
