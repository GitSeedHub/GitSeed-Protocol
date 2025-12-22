import { z } from "zod";

export const AddressSchema = z.string().min(32).max(64);

export const ChallengeRequestSchema = z.object({
  address: AddressSchema,
});

export const VerifyRequestSchema = z.object({
  address: AddressSchema,
  signature: z.string().min(10),
  nonce: z.string().min(8),
});

export const CreateProjectSchema = z.object({
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  repoUrl: z.string().url(),
  defaultBranch: z.string().min(1).max(80).default("main"),
});

export const CreateReleaseSchema = z.object({
  projectId: z.string().min(10),
  version: z.string().min(1).max(64),
  commitSha: z.string().min(7).max(64),
});

export const VerifyReleaseSchema = z.object({
  releaseId: z.string().min(10),
  artifactHash: z.string().min(10).max(200),
});
