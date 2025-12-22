import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.project.findMany({ take: 1 });
  if (existing.length > 0) return;

  const p = await prisma.project.create({
    data: {
      slug: "gitnut-demo",
      name: "GitNut Demo",
      repoUrl: "https://github.com/example/example",
      defaultBranch: "main",
    },
  });

  await prisma.release.create({
    data: {
      projectId: p.id,
      version: "0.1.0",
      commitSha: "0000000000000000000000000000000000000000",
      status: "ANCHORED",
      artifactCid: "bafybeigdyrztarifactsplaceholder",
      sbomCid: "bafybeigdyrztsbomplaceholder",
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
