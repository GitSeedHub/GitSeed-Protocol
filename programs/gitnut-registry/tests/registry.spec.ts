import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { provider, findRegistryPda, findProjectPda, findVersionPda, randomSlug, SYS } from "./_helpers";

describe("gitnut-registry / registry + project + version", () => {
  const p = provider();
  const program = anchor.workspace.GitnutRegistry as anchor.Program<any>;

  it("registers a project and publishes a version", async () => {
    const [registry] = findRegistryPda(program.programId);
    const slug = randomSlug("gitnut");
    const [project] = findProjectPda(program.programId, slug);

    const maintainers = [p.wallet.publicKey];

    await program.methods
      .registerProject({
        slug,
        repoHost: "github.com",
        repoOwner: "example",
        repoName: "demo",
        description: "Demo project registered by tests",
        tags: ["demo", "test"],
        maintainers,
      })
      .accounts({
        payer: p.wallet.publicKey,
        registry,
        project,
        ...SYS,
      })
      .rpc();

    const projectAcc = await program.account.project.fetch(project);
    expect(projectAcc.slug).to.eq(slug);
    expect(projectAcc.repoHost).to.eq("github.com");
    expect(projectAcc.owner.toBase58()).to.eq(p.wallet.publicKey.toBase58());

    const semver = "0.1.0";
    const [version] = findVersionPda(program.programId, project, semver);

    const hash = Array.from({ length: 32 }, (_, i) => i) as number[];

    await program.methods
      .publishVersion({
        semver,
        repoRef: "refs/tags/v0.1.0",
        artifactUri: "ar://example-artifact",
        contentHash: hash,
        license: "MIT",
        artifactBytes: 1234,
      })
      .accounts({
        publisher: p.wallet.publicKey,
        registry,
        project,
        version,
        ...SYS,
      })
      .rpc();

    const versionAcc = await program.account.version.fetch(version);
    expect(versionAcc.semver).to.eq(semver);
    expect(versionAcc.artifactUri).to.eq("ar://example-artifact");
    expect(versionAcc.deprecated).to.eq(false);
  });
});
