"use client";

import React, { useState } from "react";
import { VerifyPanel } from "@/features/attest/verify-panel";

export function VerifyPage() {
  const [releaseId, setReleaseId] = useState("");
  const [artifactHash, setArtifactHash] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Verify</h1>
      <p className="text-muted mt-2">
        Verify that your local artifact hash matches the release attestation anchored by GitNut.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-panel p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm">
            <div className="text-muted mb-1">Release ID</div>
            <input
              className="w-full rounded-xl border border-border bg-black/40 px-3 py-2"
              value={releaseId}
              onChange={(e) => setReleaseId(e.target.value)}
              placeholder="e.g. rel_123..."
            />
          </label>

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
      </div>

      <div className="mt-4">
        <VerifyPanel releaseId={releaseId} overrideArtifactHash={artifactHash} />
      </div>
    </div>
  );
}
