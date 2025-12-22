import * as anchor from '@coral-xyz/anchor';
import type { RegistryConfig, ProjectAccount, VersionAccount, MaintainerAccount, PolicyAccount } from '../types/registry.js';

export function parseRegistryAccount(a: any): RegistryConfig {
  return {
    authority: a.authority,
    attestationSigner: a.attestationSigner,
    createdAt: Number(a.createdAt ?? 0),
    paused: Boolean(a.paused),
  };
}

export function parseProjectAccount(a: any): ProjectAccount {
  return {
    registry: a.registry,
    projectId: String(a.projectId),
    repoUrl: String(a.repoUrl),
    owner: a.owner,
    createdAt: Number(a.createdAt ?? 0),
    lastUpdatedAt: Number(a.lastUpdatedAt ?? 0),
    deprecated: Boolean(a.deprecated),
  };
}

export function parseVersionAccount(a: any): VersionAccount {
  return {
    project: a.project,
    version: String(a.version),
    sourceHash: String(a.sourceHash),
    artifactHash: String(a.artifactHash),
    storageUri: String(a.storageUri),
    issuer: a.issuer,
    issuedAt: Number(a.issuedAt ?? 0),
    revoked: Boolean(a.revoked),
  };
}

export function parseMaintainerAccount(a: any): MaintainerAccount {
  return {
    project: a.project,
    wallet: a.wallet,
    role: (a.role as any) ?? 'maintainer',
    addedAt: Number(a.addedAt ?? 0),
  };
}

export function parsePolicyAccount(a: any): PolicyAccount {
  const max = a.maxArtifactBytes instanceof anchor.BN ? BigInt(a.maxArtifactBytes.toString()) : BigInt(a.maxArtifactBytes ?? 0);
  return {
    project: a.project,
    allowUnverified: Boolean(a.allowUnverified),
    requireLicense: Boolean(a.requireLicense),
    allowedLicenses: Array.isArray(a.allowedLicenses) ? a.allowedLicenses.map(String) : [],
    maxArtifactBytes: max,
  };
}
