export type BuildContext = {
  projectDir: string;
  outDir: string;
  allowNetwork: boolean;
  env?: Record<string, string>;
};

export type BuildOutput = {
  kind: 'node' | 'python' | 'rust' | 'static';
  artifactDir: string;
  entry?: string;
  logs: string[];
};

export interface Builder {
  kind: BuildOutput['kind'];
  build(ctx: BuildContext): Promise<BuildOutput>;
}
