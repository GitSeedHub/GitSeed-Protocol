"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { SearchBar } from "@/features/search/search-bar";

type Project = Awaited<ReturnType<typeof api.projects.list>>["items"][number];

export function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.projects
      .list()
      .then((r) => setItems(r.items))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => [p.name, p.slug, p.repoUrl].some((x) => x.toLowerCase().includes(q)));
  }, [items, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted mt-2">
            Projects registered in GitNut. Each project can publish multiple releases.
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar value={query} onChange={setQuery} placeholder="Search projects..." />
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-border bg-panel p-4 text-sm">
          <div className="font-medium">Failed to load</div>
          <div className="text-muted mt-1">{error}</div>
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {filtered.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="rounded-2xl border border-border bg-panel p-5 hover:bg-panel2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted">{p.repoUrl}</div>
              </div>
              <div className="text-sm text-muted">
                Updated {formatDate(p.updatedAt)}
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-panel p-8 text-center text-muted">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
