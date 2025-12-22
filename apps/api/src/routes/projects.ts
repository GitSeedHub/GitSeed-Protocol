import type { FastifyInstance } from "fastify";
import { listProjectsHandler, getProjectHandler, createProjectHandler } from "../controllers/projects.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export async function projectsRoutes(app: FastifyInstance) {
  app.get("/", listProjectsHandler);
  app.get("/:id", getProjectHandler);

  // write routes can be gated behind auth
  app.post("/", { preHandler: [requireAuth] }, createProjectHandler);
}
