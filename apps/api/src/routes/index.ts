import type { FastifyInstance } from "fastify";
import { healthRoutes } from "./health.js";
import { authRoutes } from "./auth.js";
import { projectsRoutes } from "./projects.js";
import { releasesRoutes } from "./releases.js";
import { attestationsRoutes } from "./attestations.js";
import { jobsRoutes } from "./jobs.js";
import { webhooksRoutes } from "./webhooks.js";

export function registerRoutes(app: FastifyInstance) {
  app.register(healthRoutes, { prefix: "/v1" });
  app.register(authRoutes, { prefix: "/v1/auth" });
  app.register(projectsRoutes, { prefix: "/v1/projects" });
  app.register(releasesRoutes, { prefix: "/v1/releases" });
  app.register(attestationsRoutes, { prefix: "/v1/attestations" });
  app.register(jobsRoutes, { prefix: "/v1/jobs" });
  app.register(webhooksRoutes, { prefix: "/v1/webhooks" });
}
