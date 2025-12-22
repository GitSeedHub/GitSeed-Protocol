import 'dotenv/config';
import { Connection, PublicKey } from '@solana/web3.js';
import pino from 'pino';
import pg from 'pg';

const log = pino({ name: 'gitnut-indexer', level: process.env.LOG_LEVEL || 'info' });

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`missing env: ${name}`);
  return v;
}

async function ensureSchema(client: pg.Client) {
  await client.query(`
    create table if not exists indexer_checkpoints (
      id text primary key,
      slot bigint not null,
      updated_at timestamptz not null default now()
    );
  `);
  await client.query(`
    create table if not exists registry_events (
      signature text primary key,
      slot bigint not null,
      program_id text not null,
      raw jsonb not null,
      created_at timestamptz not null default now()
    );
  `);
}

async function upsertEvent(client: pg.Client, e: { signature: string; slot: number; programId: string; raw: any }) {
  await client.query(
    `insert into registry_events(signature, slot, program_id, raw)
     values($1,$2,$3,$4)
     on conflict(signature) do nothing`,
    [e.signature, e.slot, e.programId, e.raw]
  );
}

async function main() {
  const rpc = process.env.SOLANA_RPC_URL || 'http://127.0.0.1:8899';
  const programId = new PublicKey(required('GITNUT_REGISTRY_PROGRAM_ID'));
  const databaseUrl = required('DATABASE_URL');

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  await ensureSchema(client);

  const conn = new Connection(rpc, { commitment: 'confirmed' });

  log.info({ rpc, programId: programId.toBase58() }, 'indexer starting');

  const subId = conn.onLogs(programId, async (logs, ctx) => {
    try {
      const raw = { logs: logs.logs, err: logs.err, signature: logs.signature, slot: ctx.slot };
      await upsertEvent(client, { signature: logs.signature, slot: ctx.slot, programId: programId.toBase58(), raw });
      log.info({ signature: logs.signature, slot: ctx.slot }, 'event stored');
    } catch (err) {
      log.error({ err }, 'failed to store event');
    }
  }, 'confirmed');

  log.info({ subId }, 'subscribed');

  process.on('SIGINT', async () => {
    log.warn('SIGINT received');
    await conn.removeOnLogsListener(subId);
    await client.end();
    process.exit(0);
  });
}

main().catch((err) => {
  log.error({ err }, 'fatal');
  process.exit(1);
});
