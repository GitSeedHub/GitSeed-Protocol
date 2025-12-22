import path from 'node:path';
import { Builder, BuildContext, BuildOutput } from './interfaces.js';
import { ensureCleanDir, copyDir } from './sandbox/filesystem.js';

export class StaticBuilder implements Builder {
  kind: BuildOutput['kind'] = 'static';

  async build(ctx: BuildContext): Promise<BuildOutput> {
    const artifactDir = path.join(ctx.outDir, 'artifacts', 'static');
    ensureCleanDir(artifactDir);
    copyDir(ctx.projectDir, artifactDir, (rel) => rel.startsWith('.git'));
    return { kind: 'static', artifactDir, entry: 'index.html', logs: [] };
  }
}
