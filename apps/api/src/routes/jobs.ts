import type { FastifyInstance } from "fastify";
import { prisma } from "../db/index.js";
import { requireAuth } from "../middleware/require-auth.js";
import { enqueueReleasePipeline } from "../queue/producers.js";

export async function jobsRoutes(app: FastifyInstance) {
  app.get("/", async (_req, res) => {
    const items = await prisma.jobRun.findMany({
      orderBy: { updatedAt: "desc" },
      take: 200,
    });
    return res.send({
      items: items.map((j) => ({
        id: j.id,
        releaseId: j.releaseId,
        kind: j.kind,
        status: j.status,
        message: j.message,
        createdAt: j.createdAt.toISOString(),
        updatedAt: j.updatedAt.toISOString(),
      })),
    });
  });

  app.post("/pipeline/:releaseId", { preHandler: [requireAuth] }, async (req, res) => {
    const { releaseId } = (req.params as any) as { releaseId: string };
    await enqueueReleasePipeline(releaseId);
    return res.code(202).send({ ok: true, enqueued: true, releaseId });
  });
}
