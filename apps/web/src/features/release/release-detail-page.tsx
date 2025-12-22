"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { formatDate, truncateMiddle } from "@/lib/format";
import { VerifyPanel } from "@/features/attest/verify-panel";

type Release = Awaited<ReturnType<typeof api.releases.get>>;

export function ReleaseDetailPage({ releaseId }: { releaseId: string }) {
  const [r, setR] = useState<Release | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.releases
      .get(releaseId)
      .then(setR)
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)));
  }, [releaseId]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/releases" className="text-sm text-brand2 hover:opacity-90">← Back</Link>

      {err && (
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6">
          <div className="font-semibold">Error</div>
          <div className="text-muted mt-2">{err}</div>
        </div>
      )}

      {!r && !err && (
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6 text-muted">Loading…</div>
      )}

      {r && (
        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-border bg-panel p-6">
            <div className="text-sm text-muted">Release</div>
            <h1 className="text-2xl font-semibold mt-1">v{r.version}</h1>

            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-panel2 p-4">
                <div className="text-muted">Commit</div>
                <div className="font-medium mt-1">{truncateMiddle(r.commitSha, 16)}</div>
              </div>
              <div className="rounded-xl border border-border bg-panel2 p-4">
                <div className="text-muted">Status</div>
                <div className="font-medium mt-1">{r.status}</div>
              </div>
              <div className="rounded-xl border border-border bg-panel2 p-4">
                <div className="text-muted">Artifacts CID</div>
                <div className="font-medium mt-1">{r.artifactCid ?? "—"}</div>
              </div>
              <div className="rounded-xl border border-border bg-panel2 p-4">
                <div className="text-muted">SBOM CID</div>
                <div className="font-medium mt-1">{r.sbomCid ?? "—"}</div>
              </div>
              <div className="rounded-xl border border-border bg-panel2 p-4">
                <div className="text-muted">Created</div>
                <div className="font-medium mt-1">{formatDate(r.createdAt)}</div>
              </div>
              <div className="rounded-xl border border-border bg-panel2 p-4">
                <div className="text-muted">Updated</div>
                <div className="font-medium mt-1">{formatDate(r.updatedAt)}</div>
              </div>
            </div>
          </div>

          <VerifyPanel releaseId={r.id} defaultArtifactCid={r.artifactCid ?? ""} />
        </div>
      )}
    </div>
  );
}
