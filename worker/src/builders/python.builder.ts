import path from 'node:path';
import { Builder, BuildContext, BuildOutput } from './interfaces.js';
import { ensureCleanDir, copyDir } from './sandbox/filesystem.js';
import { runInSandbox } from './sandbox/runner.js';

export class PythonBuilder implements Builder {
  kind: BuildOutput['kind'] = 'python';

  async build(ctx: BuildContext): Promise<BuildOutput> {
    const logs: string[] = [];
    const work = path.join(ctx.outDir, 'python-build');
    ensureCleanDir(work);

    copyDir(ctx.projectDir, work, (rel) => rel.startsWith('.git') || rel.includes('__pycache__'));

    const logFile = path.join(ctx.outDir, 'logs', 'python-build.log');

    // Try installing requirements and running a minimal check
    await runInSandbox({
      cwd: work,
      command: ['sh', '-lc', 'python -V'],
      allowNetwork: ctx.allowNetwork,
      captureLogFile: logFile,
      image: process.env.GITNUT_BUILDER_PYTHON_IMAGE || undefined,
    });

    await runInSandbox({
      cwd: work,
      command: ['sh', '-lc', 'if [ -f requirements.txt ]; then pip install -r requirements.txt; fi'],
      allowNetwork: ctx.allowNetwork,
      captureLogFile: logFile,
      image: process.env.GITNUT_BUILDER_PYTHON_IMAGE || undefined,
    });

    logs.push(logFile);

    const artifactDir = path.join(ctx.outDir, 'artifacts', 'python');
    ensureCleanDir(artifactDir);
    copyDir(work, artifactDir, (rel) => rel.startsWith('.git') || rel.includes('__pycache__'));

    return { kind: 'python', artifactDir, logs };
  }
}
