export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold capitalize">architecture</h1>
      <p className="text-muted mt-4 leading-7">
        Architecture: web UI -> API -> queue -> worker pipeline -> storage + Solana registry program -> indexer -> web UI.
      </p>
    </div>
  );
}
