import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { provider, findRegistryPda, SYS } from "./_helpers";

describe("gitnut-registry / anchor plumbing", () => {
  const p = provider();
  const program = anchor.workspace.GitnutRegistry as anchor.Program<any>;

  it("loads program id and provider", async () => {
    expect(program.programId).to.be.instanceOf(anchor.web3.PublicKey);
    expect(p.wallet.publicKey).to.be.instanceOf(anchor.web3.PublicKey);
  });

  it("initializes registry", async () => {
    const [registry] = findRegistryPda(program.programId);

    // idempotent: try fetch; if missing, initialize
    let exists = true;
    try {
      await program.account.registry.fetch(registry);
    } catch {
      exists = false;
    }
    if (!exists) {
      await program.methods
        .initialize()
        .accounts({
          payer: p.wallet.publicKey,
          registry,
          ...SYS,
        })
        .rpc();

      const acc = await program.account.registry.fetch(registry);
      expect(acc.authority.toBase58()).to.eq(p.wallet.publicKey.toBase58());
    }
  });
});
