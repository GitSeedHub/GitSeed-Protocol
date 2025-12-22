export function Stat({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6 shadow-soft">
      <div className="text-sm text-muted">{title}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
      <div className="text-sm text-muted mt-2 leading-6">{hint}</div>
    </div>
  );
}
