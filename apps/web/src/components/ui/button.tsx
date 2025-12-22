"use client";

import React from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition border";
  const styles: Record<Variant, string> = {
    primary: "bg-brand border-brand hover:opacity-90 text-black",
    secondary: "bg-panel border-border hover:bg-panel2 text-text",
    ghost: "bg-transparent border-border hover:bg-panel2 text-text",
  };

  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
