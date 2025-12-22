import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-panel p-8 shadow-soft">
          <div className="flex flex-col gap-3">
            <div className="text-sm text-muted">GitNut × Solana</div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Make open-source releases verifiable, attestable, and discoverable on-chain.
            </h1>
            <p className="text-muted max-w-2xl">
              GitNut imports a repository, produces reproducible artifacts, stores content on durable storage,
              and anchors release proofs on Solana so anyone can verify what shipped.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/projects"><Button>Browse Projects</Button></Link>
              <Link href="/verify"><Button variant="secondary">Verify a Release</Button></Link>
              <Link href="/docs"><Button variant="ghost">Docs</Button></Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Stat title="Source" value="Git repository → content hash" hint="Every import produces canonical manifests and hashes." />
          <Stat title="Build" value="Reproducible artifacts" hint="Workers run sandboxed builders with policy & limits." />
          <Stat title="Anchor" value="Solana attestations" hint="Release pointers and proofs are committed on-chain." />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Projects" desc="Search, browse, and follow projects registered on GitNut." ctaHref="/projects" ctaLabel="Open Projects" />
          <Card title="Releases" desc="Each release has artifacts, SBOM, and verifiable attestations." ctaHref="/releases" ctaLabel="View Releases" />
        </div>
      </div>
    </div>
  );
}
