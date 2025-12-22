import Link from "next/link";

const links = [
  { href: "/docs/overview", label: "Overview" },
  { href: "/docs/architecture", label: "Architecture" },
  { href: "/docs/process", label: "Process" },
  { href: "/docs/api", label: "API" },
];

export default function DocsIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Docs</h1>
      <p className="text-muted mb-6">
        This page is a lightweight entry point. In production you would mount the repo docs here.
      </p>
      <div className="grid gap-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-border bg-panel p-4 hover:bg-panel2">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
