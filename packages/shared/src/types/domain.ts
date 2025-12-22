export type RepoRef = {
  url: string;
  defaultBranch?: string;
  commit?: string;
  tag?: string;
};

export type ProjectMetadata = {
  projectId: string;
  name: string;
  description?: string;
  repo: RepoRef;
  license?: string;
  homepage?: string;
  tags?: string[];
};

export type ReleaseMetadata = {
  releaseId: string;
  projectId: string;
  version: string;
  createdAt: string;
  sourceHash: string;
  artifacts?: Array<{ kind: string; hash: string; url?: string }>;
};
