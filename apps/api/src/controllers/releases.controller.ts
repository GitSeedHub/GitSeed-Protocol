import type { FastifyRequest, FastifyReply } from "fastify";
import { createRelease, getRelease, listReleases } from "../services/release.service.js";
import { verifyRelease } from "../services/verification.service.js";

export async function listReleasesHandler(_req: FastifyRequest, res: FastifyReply) {
  const out = await listReleases();
  return res.send(out);
}

export async function getReleaseHandler(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
  const out = await getRelease(req.params.id);
  return res.send(out);
}

export async function createReleaseHandler(req: FastifyRequest, res: FastifyReply) {
  const out = await createRelease(req.body);
  return res.code(201).send(out);
}

export async function verifyReleaseHandler(req: FastifyRequest, res: FastifyReply) {
  const out = await verifyRelease(req.body);
  return res.send(out);
}
