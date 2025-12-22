import fs from 'node:fs';
import path from 'node:path';
import { Builder, BuildContext, BuildOutput } from './interfaces.js';
import { ensureCleanDir, copyDir } from './sandbox/filesystem.js';
import { runInSandbox } from './sandbox/runner.js';

export class NodeBuilder implements Builder {
  kind: BuildOutput['kind'] = 'node';

  async build(ctx: BuildContext): Promise<BuildOutput> {
    const logs: string[] = [];
    const work = path.join(ctx.outDir, 'node-build');
    ensureCleanDir(work);

    // Copy sources
    copyDir(ctx.projectDir, work, (rel) => rel.startsWith('node_modules') || rel.startsWith('.git'));

    const logFile = path.join(ctx.outDir, 'logs', 'node-build.log');

    // Install deps & run build if present
    const pkg = JSON.parse(fs.readFileSync(path.join(work, 'package.json'), 'utf-8'));
    const scripts = pkg.scripts || {};
    const hasBuild = typeof scripts.build === 'string';

    await runInSandbox({
      cwd: work,
      command: ['sh', '-lc', 'corepack enable && pnpm i --frozen-lockfile=false'],
      allowNetwork: ctx.allowNetwork,
      captureLogFile: logFile,
      image: process.env.GITNUT_BUILDER_NODE_IMAGE || undefined,
    });
    logs.push(logFile);

    if (hasBuild) {
      await runInSandbox({
        cwd: work,
        command: ['sh', '-lc', 'pnpm run build'],
        allowNetwork: ctx.allowNetwork,
        captureLogFile: logFile,
        image: process.env.GITNUT_BUILDER_NODE_IMAGE || undefined,
      });
    }

    // Produce artifact directory
    const artifactDir = path.join(ctx.outDir, 'artifacts', 'node');
    ensureCleanDir(artifactDir);

    const dist = path.join(work, 'dist');
    if (fs.existsSync(dist)) copyDir(dist, artifactDir);
    else copyDir(work, artifactDir, (rel) => rel.startsWith('node_modules') || rel.startsWith('.git'));

    return { kind: 'node', artifactDir, logs };
  }
}
