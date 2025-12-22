import type { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../errors/http-errors.js";
import { validateSession } from "../auth/sessions.js";

declare module "fastify" {
  interface FastifyRequest {
    auth?: { address: string; token: string };
  }
}

export async function requireAuth(req: FastifyRequest, _res: FastifyReply) {
  const header = req.headers.authorization?.toString() || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  if (!token) throw new UnauthorizedError("Missing Bearer token");

  const sess = await validateSession(token);
  if (!sess) throw new UnauthorizedError("Invalid session token");

  req.auth = { address: sess.address, token: sess.token };
}
