import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";
import { ChallengeRequestSchema, VerifyRequestSchema } from "../validators/schemas.js";
import { verifySolanaSignature } from "../auth/wallet-signin.js";
import { createSession } from "../auth/sessions.js";
import { BadRequestError } from "../errors/http-errors.js";

type Challenge = { message: string; nonce: string; createdAt: number };
const challenges = new Map<string, Challenge>();

function makeChallenge(address: string) {
  const nonce = nanoid(20);
  const message =
    `GitNut sign-in\n` +
    `Address: ${address}\n` +
    `Nonce: ${nonce}\n` +
    `Issued at: ${new Date().toISOString()}\n` +
    `\nBy signing, you authenticate with GitNut.`;
  const c: Challenge = { message, nonce, createdAt: Date.now() };
  challenges.set(`${address}:${nonce}`, c);
  return c;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/challenge", async (req, res) => {
    const body = ChallengeRequestSchema.parse(req.body);
    const c = makeChallenge(body.address);
    return res.send({ message: c.message, nonce: c.nonce });
  });

  app.post("/verify", async (req, res) => {
    const body = VerifyRequestSchema.parse(req.body);
    const key = `${body.address}:${body.nonce}`;
    const c = challenges.get(key);
    if (!c) throw new BadRequestError("Challenge not found or expired");

    // expire challenge after 3 minutes
    if (Date.now() - c.createdAt > 3 * 60_000) {
      challenges.delete(key);
      throw new BadRequestError("Challenge expired");
    }

    const ok = verifySolanaSignature({
      address: body.address,
      message: c.message,
      signatureBase64: body.signature,
    });

    challenges.delete(key);
    if (!ok) throw new BadRequestError("Invalid signature");

    const session = await createSession(body.address);
    return res.send(session);
  });
}
