import { z } from 'zod';

export const JobType = z.enum(['PIPELINE']);

export const PipelineInputSchema = z.object({
  repoUrl: z.string().url(),
  ref: z.string().optional(),       // branch or tag
  commit: z.string().optional(),    // if set, must be 40-char sha
  subdir: z.string().optional(),    // optional project path within repo
  projectName: z.string().min(1),
  requestedBy: z.string().optional(), // wallet pubkey or user id
  policyProfile: z.string().optional(), // e.g. "default"
});

export const JobEnvelopeSchema = z.object({
  type: JobType,
  projectId: z.string().uuid(),
  runId: z.string().uuid(),
  createdAt: z.string(),
  input: PipelineInputSchema,
});

export type PipelineInput = z.infer<typeof PipelineInputSchema>;
export type JobEnvelope = z.infer<typeof JobEnvelopeSchema>;
