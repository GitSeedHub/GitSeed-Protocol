import type { FastifyInstance } from "fastify";
import { prisma } from "../db/index.js";
import { health as solanaIndexerHealth } from "../services/solana-indexer.service.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    const db = await prisma.$queryRaw`SELECT 1 as ok`;
    return {
      ok: true,
      db,
      solanaIndexer: solanaIndexerHealth(),
      ts: new Date().toISOString(),
    };
  });
}
