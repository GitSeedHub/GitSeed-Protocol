import type { PublicKey } from '@solana/web3.js';

export type RegistryConfig = {
  authority: PublicKey;
  attestationSigner: PublicKey;
  createdAt: number;
  paused: boolean;
};

export type ProjectAccount = {
  registry: PublicKey;
  projectId: string;
  repoUrl: string;
  owner: PublicKey;
  createdAt: number;
  lastUpdatedAt: number;
  deprecated: boolean;
};

export type VersionAccount = {
  project: PublicKey;
  version: string;
  sourceHash: string;
  artifactHash: string;
  storageUri: string;
  issuer: PublicKey;
  issuedAt: number;
  revoked: boolean;
};

export type MaintainerAccount = {
  project: PublicKey;
  wallet: PublicKey;
  role: 'owner' | 'maintainer' | 'publisher';
  addedAt: number;
};

export type PolicyAccount = {
  project: PublicKey;
  allowUnverified: boolean;
  requireLicense: boolean;
  allowedLicenses: string[];
  maxArtifactBytes: bigint;
};
