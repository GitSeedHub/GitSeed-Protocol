import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

export function provider(): anchor.AnchorProvider {
  const p = anchor.AnchorProvider.env();
  anchor.setProvider(p);
  return p;
}

export function randomSlug(prefix = "proj"): string {
  const rand = Math.random().toString(16).slice(2, 10);
  return `${prefix}-${rand}`.slice(0, 32);
}

export async function airdrop(connection: anchor.web3.Connection, to: PublicKey, sol = 2): Promise<void> {
  const sig = await connection.requestAirdrop(to, sol * anchor.web3.LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");
}

export function findRegistryPda(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("gitnut_registry")], programId);
}

export function findProjectPda(programId: PublicKey, slug: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("gitnut_project"), Buffer.from(slug)], programId);
}

export function findVersionPda(programId: PublicKey, project: PublicKey, semver: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("gitnut_version"), project.toBuffer(), Buffer.from(semver)], programId);
}

export const SYS = {
  systemProgram: SystemProgram.programId,
};
