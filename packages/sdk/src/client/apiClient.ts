import { httpJson } from '@gitnut/shared';
import type { ApiProject, ApiRelease } from '../types/api.js';

export type GitNutApiClientOptions = {
  baseUrl: string;
  apiKey?: string;
};

export class GitNutApiClient {
  constructor(private readonly opts: GitNutApiClientOptions) {}

  private headers(): Record<string, string> {
    return this.opts.apiKey ? { authorization: `Bearer ${this.opts.apiKey}` } : {};
  }

  async health(): Promise<{ ok: true }> {
    const res = await httpJson<{ ok: true }>({
      method: 'GET',
      url: `${this.opts.baseUrl}/health`,
      headers: this.headers(),
    });
    return res.data;
  }

  async listProjects(): Promise<ApiProject[]> {
    const res = await httpJson<ApiProject[]>({
      method: 'GET',
      url: `${this.opts.baseUrl}/projects`,
      headers: this.headers(),
    });
    return res.data;
  }

  async getProject(id: string): Promise<ApiProject> {
    const res = await httpJson<ApiProject>({
      method: 'GET',
      url: `${this.opts.baseUrl}/projects/${encodeURIComponent(id)}`,
      headers: this.headers(),
    });
    return res.data;
  }

  async listReleases(projectId: string): Promise<ApiRelease[]> {
    const res = await httpJson<ApiRelease[]>({
      method: 'GET',
      url: `${this.opts.baseUrl}/projects/${encodeURIComponent(projectId)}/releases`,
      headers: this.headers(),
    });
    return res.data;
  }

  async createProject(input: { name: string; repoUrl: string; description?: string }): Promise<ApiProject> {
    const res = await httpJson<ApiProject>({
      method: 'POST',
      url: `${this.opts.baseUrl}/projects`,
      headers: this.headers(),
      body: input,
    });
    return res.data;
  }
}
