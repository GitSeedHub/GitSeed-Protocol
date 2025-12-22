import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { provider, findRegistryPda, findProjectPda, randomSlug, SYS } from "./_helpers";

describe("gitnut-registry / policy", () => {
  const p = provider();
  const program = anchor.workspace.GitnutRegistry as anchor.Program<any>;

  it("updates project policy", async () => {
    const [registry] = findRegistryPda(program.programId);
    const slug = randomSlug("policy");
    const [project] = findProjectPda(program.programId, slug);

    await program.methods
      .registerProject({
        slug,
        repoHost: "github.com",
        repoOwner: "example",
        repoName: "policy-demo",
        description: "Policy demo project",
        tags: ["policy"],
        maintainers: [p.wallet.publicKey],
      })
      .accounts({ payer: p.wallet.publicKey, registry, project, ...SYS })
      .rpc();

    await program.methods
      .setPolicy({
        allowAnyLicense: false,
        allowedLicenses: ["MIT", "Apache-2.0"],
        maxBlobBytes: 1024 * 1024,
        enforceTags: true,
      })
      .accounts({ signer: p.wallet.publicKey, project })
      .rpc();

    const acc = await program.account.project.fetch(project);
    expect(acc.policy.license.allowAny).to.eq(false);
    expect(acc.policy.license.allowed).to.deep.eq(["MIT", "Apache-2.0"]);
    expect(acc.policy.content.maxBlobBytes.toNumber()).to.eq(1024 * 1024);
  });
});
