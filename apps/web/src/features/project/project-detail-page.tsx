"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { formatDate, truncateMiddle } from "@/lib/format";

type Project = Awaited<ReturnType<typeof api.projects.get>>;

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const [p, setP] = useState<Project | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.projects
      .get(projectId)
      .then(setP)
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)));
  }, [projectId]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/projects" className="text-sm text-brand2 hover:opacity-90">← Back</Link>

      {err && (
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6">
          <div className="font-semibold">Error</div>
          <div className="text-muted mt-2">{err}</div>
        </div>
      )}

      {!p && !err && (
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6 text-muted">Loading…</div>
      )}

      {p && (
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6">
          <div className="text-sm text-muted">{p.slug}</div>
          <h1 className="text-2xl font-semibold mt-1">{p.name}</h1>

          <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border bg-panel2 p-4">
              <div className="text-muted">Repository</div>
              <div className="font-medium mt-1">{p.repoUrl}</div>
            </div>
            <div className="rounded-xl border border-border bg-panel2 p-4">
              <div className="text-muted">Default branch</div>
              <div className="font-medium mt-1">{p.defaultBranch}</div>
            </div>
            <div className="rounded-xl border border-border bg-panel2 p-4">
              <div className="text-muted">Created</div>
              <div className="font-medium mt-1">{formatDate(p.createdAt)}</div>
            </div>
            <div className="rounded-xl border border-border bg-panel2 p-4">
              <div className="text-muted">Updated</div>
              <div className="font-medium mt-1">{formatDate(p.updatedAt)}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-border bg-black/40 px-4 py-2 text-sm hover:bg-panel2"
              href="/releases"
            >
              View all releases
            </Link>
            <a
              className="rounded-xl border border-border bg-black/40 px-4 py-2 text-sm hover:bg-panel2"
              href={p.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open repo ({truncateMiddle(p.repoUrl, 18)})
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
