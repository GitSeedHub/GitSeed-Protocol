import { z } from 'zod';

/**
 * GitNut internal identifiers.
 * These are intentionally simple strings: use validation at edges.
 */
export const ProjectIdSchema = z.string().min(3).max(128);
export const ReleaseIdSchema = z.string().min(3).max(128);
export const RepoUrlSchema = z.string().url();
export const SemverSchema = z.string().min(1).max(64);

export const ContentHashSchema = z.object({
  alg: z.enum(['sha256', 'blake3']),
  hex: z.string().regex(/^[0-9a-fA-F]{16,}$/),
});

export const AttestationSchema = z.object({
  kind: z.enum(['source', 'build', 'release', 'sbom']),
  version: z.string().min(1).max(32),
  subject: z.object({
    projectId: ProjectIdSchema,
    releaseId: ReleaseIdSchema.optional(),
    sourceHash: ContentHashSchema.optional(),
    artifactHash: ContentHashSchema.optional(),
  }),
  issuedAt: z.string().datetime(),
  issuer: z.object({
    id: z.string().min(3).max(128),
    publicKey: z.string().min(16).max(512),
  }),
  claims: z.record(z.any()).default({}),
  signature: z.string().min(16).max(4096),
});

export type ProjectId = z.infer<typeof ProjectIdSchema>;
export type ReleaseId = z.infer<typeof ReleaseIdSchema>;
export type ContentHash = z.infer<typeof ContentHashSchema>;
export type Attestation = z.infer<typeof AttestationSchema>;
