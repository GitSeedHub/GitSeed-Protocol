"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/format";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/releases", label: "Releases" },
  { href: "/verify", label: "Verify" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { session, signOut, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-tight">
          GitNut
        </Link>

        <nav className="hidden md:flex items-center gap-2 ml-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm hover:bg-panel2 border border-transparent",
                pathname === n.href ? "bg-panel border-border" : "text-muted"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => signOut()}
              title={session.address}
            >
              Signed in
            </Button>
          ) : (
            <span className="text-sm text-muted hidden sm:block">Connect wallet → Sign in</span>
          )}
          <WalletMultiButton className="!bg-[rgb(139_92_246)] hover:!opacity-90" />
        </div>
      </div>
    </header>
  );
}
