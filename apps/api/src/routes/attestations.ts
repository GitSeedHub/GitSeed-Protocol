import type { FastifyInstance } from "fastify";
import { prisma } from "../db/index.js";
import { requireAuth } from "../middleware/require-auth.js";

export async function attestationsRoutes(app: FastifyInstance) {
  app.get("/release/:releaseId", async (req, res) => {
    const { releaseId } = (req.params as any) as { releaseId: string };
    const items = await prisma.attestation.findMany({
      where: { releaseId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.send({
      items: items.map((a) => ({
        id: a.id,
        kind: a.kind,
        payloadJson: a.payloadJson,
        signature: a.signature,
        signerKeyId: a.signerKeyId,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  });

  app.post("/", { preHandler: [requireAuth] }, async (req, res) => {
    const body = req.body as any;
    const created = await prisma.attestation.create({
      data: {
        releaseId: body.releaseId,
        kind: body.kind,
        payloadJson: body.payloadJson ?? {},
        signature: body.signature ?? "",
        signerKeyId: body.signerKeyId ?? "local-dev",
      },
    });
    return res.code(201).send({ id: created.id });
  });
}
