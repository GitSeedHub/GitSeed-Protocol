/**
 * Solana indexer service placeholder.
 * Real implementation would connect to:
 * - WebSocket logs subscription, or
 * - a Geyser plugin feed, or
 * - an RPC indexing provider
 *
 * This service is kept in the API for convenience; you may move it to the `apps/indexer` service.
 */
export function health() {
  return { ok: true, mode: "stub" };
}
