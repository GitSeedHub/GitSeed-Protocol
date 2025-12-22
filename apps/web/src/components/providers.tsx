"use client";

import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthProvider } from "@/features/auth/auth-context";

import "@solana/wallet-adapter-react-ui/styles.css";

function resolveEndpoint() {
  const env = process.env.NEXT_PUBLIC_SOLANA_RPC;
  if (env && env.length > 0) return env;
  const net = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet") as WalletAdapterNetwork;
  return clusterApiUrl(net);
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => resolveEndpoint(), []);
  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
