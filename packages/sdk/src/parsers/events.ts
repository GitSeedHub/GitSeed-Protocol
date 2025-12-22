/**
 * Anchor event parsing depends on provider and program setup.
 * This file provides helpers for log decoding when using Anchor's event parser.
 */

import type * as anchor from '@coral-xyz/anchor';

export type ParsedEvent<T = unknown> = {
  name: string;
  data: T;
};

export async function parseEventsFromTransaction<T = unknown>(opts: {
  program: anchor.Program;
  signature: string;
}): Promise<ParsedEvent<T>[]> {
  const tx = await opts.program.provider.connection.getTransaction(opts.signature, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0,
  });

  const logs = tx?.meta?.logMessages ?? [];
  const parser = new (opts.program as any).coder.events;
  const out: ParsedEvent<T>[] = [];

  for (const l of logs) {
    const evt = parser.decode(l);
    if (!evt) continue;
    out.push({ name: evt.name, data: evt.data as T });
  }

  return out;
}
