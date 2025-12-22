/**
 * Webhook endpoints for GitHub / CI.
 * In production: validate signatures, map events to projects, and create releases.
 */
import type { FastifyInstance } from "fastify";

export async function webhooksRoutes(app: FastifyInstance) {
  app.post("/github", async (req, res) => {
    const event = req.headers["x-github-event"]?.toString() || "unknown";
    const delivery = req.headers["x-github-delivery"]?.toString() || "unknown";
    app.log.info({ event, delivery }, "received github webhook");
    return res.send({ ok: true });
  });
}
