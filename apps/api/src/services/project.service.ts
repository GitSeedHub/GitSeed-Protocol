import { prisma } from "../db/index.js";
import { CreateProjectSchema } from "../validators/schemas.js";
import { normalizeRepoUrl } from "./github.service.js";
import { BadRequestError, NotFoundError } from "../errors/http-errors.js";

export async function listProjects() {
  const items = await prisma.project.findMany({
    where: { isArchived: false },
    orderBy: { updatedAt: "desc" },
  });
  return { items: items.map(serializeProject) };
}

export async function getProject(id: string) {
  const p = await prisma.project.findUnique({ where: { id } });
  if (!p) throw new NotFoundError("Project not found");
  return serializeProject(p);
}

export async function createProject(input: unknown) {
  const data = CreateProjectSchema.parse(input);
  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) throw new BadRequestError("Slug already exists");
  const p = await prisma.project.create({
    data: {
      slug: data.slug,
      name: data.name,
      repoUrl: normalizeRepoUrl(data.repoUrl),
      defaultBranch: data.defaultBranch,
    },
  });
  return serializeProject(p);
}

function serializeProject(p: any) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    repoUrl: p.repoUrl,
    defaultBranch: p.defaultBranch,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
