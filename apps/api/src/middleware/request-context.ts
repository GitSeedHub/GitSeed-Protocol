import type { FastifyRequest, FastifyReply } from "fastify";
import { nanoid } from "nanoid";

declare module "fastify" {
  interface FastifyRequest {
    requestId: string;
    startTime: number;
  }
}

export async function attachRequestContext(req: FastifyRequest, _res: FastifyReply) {
  req.requestId = req.headers["x-request-id"]?.toString() || nanoid(12);
  req.startTime = Date.now();
}
