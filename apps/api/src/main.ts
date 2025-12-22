import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { registerRoutes } from "./routes/index.js";
import { attachRequestContext } from "./middleware/request-context.js";

async function bootstrap() {
  const app = Fastify({ logger });

  await app.register(sensible);
  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean),
    credentials: true,
  });

  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  });

  await app.register(swagger, {
    openapi: {
      info: { title: "GitNut API", version: "0.1.0" },
    },
  });

  await app.register(swaggerUI, { routePrefix: "/docs" });

  app.addHook("onRequest", attachRequestContext);

  registerRoutes(app);

  await app.listen({ port: env.PORT, host: env.HOST });
  app.log.info({ port: env.PORT }, "GitNut API is running");
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
