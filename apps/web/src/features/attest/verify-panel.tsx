"use client";

import React, { useMemo, useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export function VerifyPanel({
  releaseId,
  defaultArtifactCid,
  overrideArtifactHash,
}: {
  releaseId: string;
  defaultArtifactCid?: string;
  overrideArtifactHash?: string;
}) {
  const [artifactHash, setArtifactHash] = useState(overrideArtifactHash ?? "");
  const [result, setResult] = useState<null | { ok: boolean; verdict: string; details: string[] }>(null);
  const [loading, setLoading] = useState(false);
  const canVerify = useMemo(() => releaseId.trim().length > 0 && artifactHash.trim().length > 0, [releaseId, artifactHash]);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await api.releases.verify({ releaseId: releaseId.trim(), artifactHash: artifactHash.trim() });
      setResult(r);
    } catch (e) {
      setResult({ ok: false, verdict: "ERROR", details: [e instanceof Error ? e.message : String(e)] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="font-semibold">Verification</div>
          <div className="text-sm text-muted mt-1">
            Provide an artifact hash (for example sha256 of a tarball) and compare against the stored release attestation.
          </div>
          {defaultArtifactCid ? (
            <div className="text-xs text-muted mt-2">
              Stored artifacts: <span className="text-text">{defaultArtifactCid}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled={!canVerify || loading} onClick={run}>
            {loading ? "Verifying…" : "Verify"}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <label className="text-sm">
          <div className="text-muted mb-1">Artifact hash</div>
          <input
            className="w-full rounded-xl border border-border bg-black/40 px-3 py-2"
            value={artifactHash}
            onChange={(e) => setArtifactHash(e.target.value)}
            placeholder="sha256:..."
          />
        </label>
      </div>

      {result && (
        <div className="mt-4 rounded-xl border border-border bg-black/30 p-4">
          <div className="text-sm">
            <span className="text-muted">Verdict:</span>{" "}
            <span className="font-semibold">{result.verdict}</span>
          </div>
          <ul className="mt-2 text-sm text-muted list-disc pl-5">
            {result.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
