export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted flex flex-col md:flex-row gap-2 md:gap-6">
        <div>© {new Date().getFullYear()} GitNut</div>
        <div className="md:ml-auto">
          Built for verifiable software releases on Solana.
        </div>
      </div>
    </footer>
  );
}
