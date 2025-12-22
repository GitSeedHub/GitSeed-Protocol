import { prisma } from "../db/index.js";
import { CreateReleaseSchema } from "../validators/schemas.js";
import { BadRequestError, NotFoundError } from "../errors/http-errors.js";

export async function listReleases() {
  const items = await prisma.release.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return { items: items.map(serializeRelease) };
}

export async function getRelease(id: string) {
  const r = await prisma.release.findUnique({ where: { id } });
  if (!r) throw new NotFoundError("Release not found");
  return serializeRelease(r);
}

export async function createRelease(input: unknown) {
  const data = CreateReleaseSchema.parse(input);
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) throw new BadRequestError("Invalid projectId");

  const r = await prisma.release.create({
    data: {
      projectId: data.projectId,
      version: data.version,
      commitSha: data.commitSha,
      status: "PENDING",
    },
  });

  return serializeRelease(r);
}

export async function updateReleaseStatus(releaseId: string, status: any, error?: string) {
  const r = await prisma.release.update({
    where: { id: releaseId },
    data: { status, error: error ?? null },
  });
  return serializeRelease(r);
}

export async function attachReleaseCids(releaseId: string, artifactCid?: string, sbomCid?: string) {
  const r = await prisma.release.update({
    where: { id: releaseId },
    data: { artifactCid: artifactCid ?? undefined, sbomCid: sbomCid ?? undefined },
  });
  return serializeRelease(r);
}

function serializeRelease(r: any) {
  return {
    id: r.id,
    projectId: r.projectId,
    version: r.version,
    commitSha: r.commitSha,
    artifactCid: r.artifactCid,
    sbomCid: r.sbomCid,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
