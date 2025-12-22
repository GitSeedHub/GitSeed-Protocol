import { PublicKey, TransactionInstruction, Transaction, SystemProgram } from '@solana/web3.js';
import { createConnection } from './connection.js';
import { loadKeypairFromFile, sendTx } from './tx.js';
import { deriveProjectPda, deriveVersionPda } from './pda.js';

/**
 * This client is intentionally minimal.
 * It assumes an Anchor program exists at `GITNUT_REGISTRY_PROGRAM_ID`.
 * The instruction layouts are not implemented here; in production, use the generated IDL.
 *
 * The worker can still run without anchoring by setting no program id.
 */
export class RegistryClient {
  constructor(
    readonly rpcUrl: string,
    readonly programId: PublicKey,
    readonly signerPath: string,
  ) {}

  async anchorVersion(params: {
    projectId: string;
    version: string;
    sourceSha256: string;
    buildSha256: string;
    sbomSha256: string;
    manifestSha256: string;
  }) {
    const connection = createConnection(this.rpcUrl);
    const payer = loadKeypairFromFile(this.signerPath);

    const [projectPda] = deriveProjectPda(this.programId, params.projectId);
    const [versionPda] = deriveVersionPda(this.programId, params.projectId, params.version);

    // Placeholder instruction: uses SystemProgram memo-like data in a no-op transfer of 0 lamports.
    // Replace with real program instruction.
    const data = Buffer.from(JSON.stringify({
      projectId: params.projectId,
      version: params.version,
      sourceSha256: params.sourceSha256,
      buildSha256: params.buildSha256,
      sbomSha256: params.sbomSha256,
      manifestSha256: params.manifestSha256,
    }));

    const ix = new TransactionInstruction({
      programId: SystemProgram.programId,
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectPda, isSigner: false, isWritable: false },
        { pubkey: versionPda, isSigner: false, isWritable: false },
      ],
      data,
    });

    const tx = new Transaction().add(ix);
    return await sendTx(connection, payer, tx);
  }
}
