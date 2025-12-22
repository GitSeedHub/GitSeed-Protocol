/**
 * Verification service compares an input hash with the stored attestation.
 * This is a simplified implementation; in production you would:
 * - retrieve attestation payloads
 * - validate signatures
 * - verify Solana on-chain state / program logs
 */
import { prisma } from "../db/index.js";
import { VerifyReleaseSchema } from "../validators/schemas.js";
import { NotFoundError } from "../errors/http-errors.js";

export async function verifyRelease(input: unknown) {
  const data = VerifyReleaseSchema.parse(input);
  const rel = await prisma.release.findUnique({ where: { id: data.releaseId } });
  if (!rel) throw new NotFoundError("Release not found");

  const att = await prisma.attestation.findFirst({
    where: { releaseId: rel.id, kind: "release" },
    orderBy: { createdAt: "desc" },
  });

  const details: string[] = [];
  if (!att) {
    details.push("No release attestation found for this release ID.");
    details.push("Verdict is UNKNOWN until an attestation is published.");
    return { ok: true, verdict: "UNKNOWN" as const, details };
  }

  const payload = att.payloadJson as any;
  const expected = payload?.artifactHash as string | undefined;

  if (!expected) {
    details.push("Attestation payload is missing artifactHash.");
    return { ok: true, verdict: "UNKNOWN" as const, details };
  }

  if (expected === data.artifactHash) {
    details.push("Provided artifact hash matches the latest attestation.");
    details.push(`Signer key id: ${att.signerKeyId}`);
    return { ok: true, verdict: "MATCH" as const, details };
  }

  details.push("Provided artifact hash does not match the latest attestation.");
  details.push(`Expected: ${expected}`);
  details.push(`Provided: ${data.artifactHash}`);
  return { ok: true, verdict: "MISMATCH" as const, details };
}
