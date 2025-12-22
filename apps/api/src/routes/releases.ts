import type { FastifyInstance } from "fastify";
import { listReleasesHandler, getReleaseHandler, createReleaseHandler, verifyReleaseHandler } from "../controllers/releases.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export async function releasesRoutes(app: FastifyInstance) {
  app.get("/", listReleasesHandler);
  app.get("/:id", getReleaseHandler);
  app.post("/", { preHandler: [requireAuth] }, createReleaseHandler);
  app.post("/verify", verifyReleaseHandler);
}
