import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { prisma } from "../db/index.js";
import { env } from "../config/env.js";

export type SessionTokenPayload = {
  sid: string;
  address: string;
};

export async function createSession(address: string) {
  const sid = nanoid(16);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_SECONDS * 1000);
  const token = jwt.sign({ sid, address } satisfies SessionTokenPayload, env.JWT_SECRET, {
    expiresIn: env.SESSION_TTL_SECONDS,
  });

  await prisma.session.create({
    data: {
      address,
      token,
      expiresAt,
    },
  });

  return { token, address, expiresAt: expiresAt.toISOString() };
}

export async function validateSession(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as SessionTokenPayload;
    const s = await prisma.session.findUnique({ where: { token } });
    if (!s) return null;
    if (s.expiresAt.getTime() < Date.now()) return null;
    return { address: payload.address, token, expiresAt: s.expiresAt.toISOString() };
  } catch {
    return null;
  }
}
