import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { provider, airdrop, findRegistryPda, findProjectPda, randomSlug, SYS } from "./_helpers";

describe("gitnut-registry / access control", () => {
  const p = provider();
  const program = anchor.workspace.GitnutRegistry as anchor.Program<any>;

  it("prevents non-owner transfer", async () => {
    const [registry] = findRegistryPda(program.programId);
    const slug = randomSlug("acl");
    const [project] = findProjectPda(program.programId, slug);

    await program.methods
      .registerProject({
        slug,
        repoHost: "github.com",
        repoOwner: "example",
        repoName: "acl-demo",
        description: "ACL demo project",
        tags: ["acl"],
        maintainers: [p.wallet.publicKey],
      })
      .accounts({ payer: p.wallet.publicKey, registry, project, ...SYS })
      .rpc();

    const attacker = Keypair.generate();
    await airdrop(p.connection, attacker.publicKey, 1);

    let threw = false;
    try {
      await program.methods
        .transferProject({ newOwner: attacker.publicKey })
        .accounts({ signer: attacker.publicKey, project })
        .signers([attacker])
        .rpc();
    } catch {
      threw = true;
    }
    expect(threw).to.eq(true);
  });
});
