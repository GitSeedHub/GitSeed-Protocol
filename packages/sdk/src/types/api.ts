export type ApiProject = {
  id: string;
  name: string;
  description?: string;
  repoUrl: string;
  createdAt: string;
};

export type ApiRelease = {
  id: string;
  projectId: string;
  version: string;
  sourceHash: string;
  artifactHash?: string;
  storageUri?: string;
  createdAt: string;
};

export type ApiAttestation = {
  kind: 'source' | 'build' | 'release' | 'sbom';
  json: string;
  sha256: string;
  signature: string;
};
