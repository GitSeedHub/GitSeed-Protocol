import fs from 'node:fs';
import path from 'node:path';
import { Builder, BuildContext, BuildOutput } from './interfaces.js';
import { ensureCleanDir, copyDir } from './sandbox/filesystem.js';
import { runInSandbox } from './sandbox/runner.js';

export class RustBuilder implements Builder {
  kind: BuildOutput['kind'] = 'rust';

  async build(ctx: BuildContext): Promise<BuildOutput> {
    const logs: string[] = [];
    const work = path.join(ctx.outDir, 'rust-build');
    ensureCleanDir(work);

    copyDir(ctx.projectDir, work, (rel) => rel.startsWith('.git') || rel.startsWith('target'));

    const logFile = path.join(ctx.outDir, 'logs', 'rust-build.log');

    const hasCargo = fs.existsSync(path.join(work, 'Cargo.toml'));
    if (hasCargo) {
      await runInSandbox({
        cwd: work,
        command: ['sh', '-lc', 'cargo --version'],
        allowNetwork: ctx.allowNetwork,
        captureLogFile: logFile,
        image: process.env.GITNUT_BUILDER_RUST_IMAGE || undefined,
      });

      await runInSandbox({
        cwd: work,
        command: ['sh', '-lc', 'cargo build --locked || cargo build'],
        allowNetwork: ctx.allowNetwork,
        captureLogFile: logFile,
        image: process.env.GITNUT_BUILDER_RUST_IMAGE || undefined,
      });
    }

    logs.push(logFile);

    const artifactDir = path.join(ctx.outDir, 'artifacts', 'rust');
    ensureCleanDir(artifactDir);

    const target = path.join(work, 'target');
    if (fs.existsSync(target)) copyDir(target, path.join(artifactDir, 'target'));
    copyDir(work, path.join(artifactDir, 'src'), (rel) => rel.startsWith('target') || rel.startsWith('.git'));

    return { kind: 'rust', artifactDir, logs };
  }
}
