import type { FastifyRequest, FastifyReply } from "fastify";
import { createProject, getProject, listProjects } from "../services/project.service.js";

export async function listProjectsHandler(_req: FastifyRequest, res: FastifyReply) {
  const out = await listProjects();
  return res.send(out);
}

export async function getProjectHandler(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
  const out = await getProject(req.params.id);
  return res.send(out);
}

export async function createProjectHandler(req: FastifyRequest, res: FastifyReply) {
  const out = await createProject(req.body);
  return res.code(201).send(out);
}
