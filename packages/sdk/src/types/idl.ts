/**
 * Minimal IDL types to avoid coupling to a single codegen strategy.
 * You can swap in anchor's generated types later.
 */
export type AnchorIdl = {
  version: string;
  name: string;
  instructions?: unknown[];
  accounts?: unknown[];
  types?: unknown[];
  events?: unknown[];
  errors?: unknown[];
  metadata?: Record<string, unknown>;
};
