import fs from 'node:fs';
import path from 'node:path';

export type StepStatus = 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';

export type PipelineSnapshot = {
  projectId: string;
  runId: string;
  status: 'RUNNING' | 'DONE' | 'FAILED';
  steps: Record<string, { status: StepStatus; startedAt?: string; endedAt?: string; meta?: any }>;
  artifacts: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

function now() {
  return new Date().toISOString();
}

export class PipelineStateStore {
  private dir: string;
  private file: string;
  private state: PipelineSnapshot;

  constructor(projectId: string, runId: string) {
    this.dir = path.resolve(process.cwd(), '.gitnut-state', projectId, runId);
    this.file = path.join(this.dir, 'state.json');
    fs.mkdirSync(this.dir, { recursive: true });

    if (fs.existsSync(this.file)) {
      const raw = fs.readFileSync(this.file, 'utf-8');
      this.state = JSON.parse(raw) as PipelineSnapshot;
    } else {
      this.state = {
        projectId,
        runId,
        status: 'RUNNING',
        steps: {},
        artifacts: {},
        createdAt: now(),
        updatedAt: now(),
      };
      this.persist();
    }
  }

  snapshot() {
    return this.state;
  }

  private persist() {
    this.state.updatedAt = now();
    fs.writeFileSync(this.file, JSON.stringify(this.state, null, 2));
  }

  stepStart(step: string, meta?: any) {
    this.state.steps[step] = { status: 'RUNNING', startedAt: now(), meta };
    this.persist();
  }

  stepDone(step: string, meta?: any) {
    const prev = this.state.steps[step] || { status: 'PENDING' as const };
    this.state.steps[step] = { ...prev, status: 'DONE', endedAt: now(), meta };
    this.persist();
  }

  stepFail(step: string, error: any) {
    const prev = this.state.steps[step] || { status: 'PENDING' as const };
    this.state.steps[step] = {
      ...prev,
      status: 'FAILED',
      endedAt: now(),
      meta: { ...(prev as any).meta, error: String(error?.message || error) },
    };
    this.state.status = 'FAILED';
    this.persist();
  }

  putArtifact(key: string, value: any) {
    this.state.artifacts[key] = value;
    this.persist();
  }

  getArtifact<T = any>(key: string): T | undefined {
    return this.state.artifacts[key] as T | undefined;
  }

  async markComplete() {
    this.state.status = 'DONE';
    this.persist();
  }
}
