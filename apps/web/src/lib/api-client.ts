import { z } from "zod";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787";

async function http<T>(path: string, init?: RequestInit, schema?: z.ZodSchema<T>): Promise<T> {
  const url = API_BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  const data = (await res.json()) as unknown;
  return schema ? schema.parse(data) : (data as T);
}

const ChallengeSchema = z.object({
  message: z.string(),
  nonce: z.string(),
});

const VerifySchema = z.object({
  token: z.string(),
  address: z.string(),
  expiresAt: z.string(),
});

const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  repoUrl: z.string(),
  defaultBranch: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ReleaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  version: z.string(),
  commitSha: z.string(),
  artifactCid: z.string().nullable(),
  sbomCid: z.string().nullable(),
  status: z.enum(["PENDING", "BUILDING", "ATTESTING", "ANCHORED", "FAILED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const api = {
  auth: {
    challenge: (body: { address: string }) =>
      http("/v1/auth/challenge", { method: "POST", body: JSON.stringify(body) }, ChallengeSchema),
    verify: (body: { address: string; signature: string; nonce: string }) =>
      http("/v1/auth/verify", { method: "POST", body: JSON.stringify(body) }, VerifySchema),
  },
  projects: {
    list: () => http("/v1/projects", undefined, z.object({ items: z.array(ProjectSchema) })),
    get: (id: string) => http(`/v1/projects/${encodeURIComponent(id)}`, undefined, ProjectSchema),
  },
  releases: {
    list: () => http("/v1/releases", undefined, z.object({ items: z.array(ReleaseSchema) })),
    get: (id: string) => http(`/v1/releases/${encodeURIComponent(id)}`, undefined, ReleaseSchema),
    verify: (body: { releaseId: string; artifactHash: string }) =>
      http("/v1/releases/verify", { method: "POST", body: JSON.stringify(body) }, z.object({
        ok: z.boolean(),
        verdict: z.enum(["MATCH", "MISMATCH", "UNKNOWN"]),
        details: z.array(z.string()),
      })),
  },
};
