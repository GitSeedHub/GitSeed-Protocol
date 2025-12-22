import { z } from 'zod';

export const SourceAttestationV1 = z.object({
  schema: z.literal('gitnut.attestation.source.v1'),
  projectId: z.string(),
  runId: z.string(),
  repoUrl: z.string().url(),
  ref: z.string().optional(),
  commit: z.string(),
  source: z.object({
    archiveSha256: z.string(),
    archiveBytes: z.number().int().nonnegative(),
  }),
  manifest: z.object({
    canonicalJsonSha256: z.string(),
  }),
  createdAt: z.string(),
});

export const BuildAttestationV1 = z.object({
  schema: z.literal('gitnut.attestation.build.v1'),
  projectId: z.string(),
  runId: z.string(),
  build: z.object({
    kind: z.enum(['node', 'python', 'rust', 'static']),
    artifactSha256: z.string(),
    artifactBytes: z.number().int().nonnegative(),
  }),
  sbom: z.object({
    sbomSha256: z.string(),
    sbomBytes: z.number().int().nonnegative(),
  }),
  createdAt: z.string(),
});

export const SignedEnvelopeV1 = z.object({
  schema: z.literal('gitnut.signed-envelope.v1'),
  payload: z.any(),
  payloadSha256: z.string(),
  signature: z.string(), // base64
  publicKey: z.string(), // base64
  createdAt: z.string(),
});
