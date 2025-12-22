"use client";

import React from "react";
import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-panel px-3 py-2">
      <Search size={16} className="text-muted" />
      <input
        className="w-full bg-transparent outline-none text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
      />
    </div>
  );
}
