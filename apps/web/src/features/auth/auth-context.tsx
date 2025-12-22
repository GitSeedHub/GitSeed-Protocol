"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "@/lib/api-client";

type Session = {
  token: string;
  address: string;
  expiresAt: string;
};

type AuthCtx = {
  session: Session | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "gitnut.session.v1";

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(s: Session | null) {
  if (!s) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const signIn = async () => {
    if (!wallet.publicKey || !wallet.signMessage) return;
    setIsLoading(true);
    try {
      const challenge = await api.auth.challenge({ address: wallet.publicKey.toBase58() });
      const msg = new TextEncoder().encode(challenge.message);
      const sig = await wallet.signMessage(msg);
      const verify = await api.auth.verify({
        address: wallet.publicKey.toBase58(),
        signature: Buffer.from(sig).toString("base64"),
        nonce: challenge.nonce,
      });
      const sess: Session = { token: verify.token, address: verify.address, expiresAt: verify.expiresAt };
      setSession(sess);
      saveSession(sess);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setSession(null);
      saveSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto sign-in when wallet connects and no session exists.
  useEffect(() => {
    if (!wallet.connected) return;
    if (session) return;
    // avoid spamming
    const t = setTimeout(() => {
      signIn().catch(() => {});
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected, wallet.publicKey?.toBase58()]);

  const value = useMemo<AuthCtx>(() => ({ session, isLoading, signIn, signOut }), [session, isLoading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
