import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Card({
  title,
  desc,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  desc: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6 shadow-soft">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-muted mt-2 leading-7">{desc}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 mt-4 text-sm text-brand2 hover:opacity-90"
      >
        {ctaLabel} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
