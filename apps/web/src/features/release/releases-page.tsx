"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { SearchBar } from "@/features/search/search-bar";
import { formatDate, truncateMiddle } from "@/lib/format";

type Release = Awaited<ReturnType<typeof api.releases.list>>["items"][number];

function Badge({ status }: { status: Release["status"] }) {
  const map: Record<Release["status"], string> = {
    PENDING: "bg-zinc-800",
    BUILDING: "bg-blue-900",
    ATTESTING: "bg-purple-900",
    ANCHORED: "bg-emerald-900",
    FAILED: "bg-red-900",
  };
  return (
    <span className={`px-2 py-1 rounded-lg text-xs border border-border ${map[status]}`}>
      {status}
    </span>
  );
}

export function ReleasesPage() {
  const [items, setItems] = useState<Release[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.releases
      .list()
      .then((r) => setItems(r.items))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => [r.version, r.commitSha, r.status].some((x) => x.toLowerCase().includes(q)));
  }, [items, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Releases</h1>
          <p className="text-muted mt-2">
            Releases reference immutable artifacts and proofs.
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar value={query} onChange={setQuery} placeholder="Search releases..." />
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-border bg-panel p-4 text-sm">
          <div className="font-medium">Failed to load</div>
          <div className="text-muted mt-1">{error}</div>
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {filtered.map((r) => (
          <Link key={r.id} href={`/releases/${r.id}`} className="rounded-2xl border border-border bg-panel p-5 hover:bg-panel2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex-1">
                <div className="font-semibold">v{r.version}</div>
                <div className="text-sm text-muted">commit {truncateMiddle(r.commitSha, 10)}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={r.status} />
                <div className="text-sm text-muted">{formatDate(r.updatedAt)}</div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-panel p-8 text-center text-muted">
            No releases found.
          </div>
        )}
      </div>
    </div>
  );
}
