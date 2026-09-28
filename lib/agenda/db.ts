import { Pool, type PoolClient } from "pg";

// Pool singleton (sobrevive al hot-reload de Next en dev).
// En Vercel/serverless conviene un pooler (PgBouncer) delante; aquí mantenemos
// el pool pequeño para no agotar conexiones del Postgres del ERP.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export const pool: Pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") global.__pgPool = pool;

export async function query<T = unknown>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await pool.query(text, params as never[]);
  return res.rows as T[];
}

// Ejecuta `fn` dentro de una transacción; hace rollback si lanza.
export async function withTx<T>(
  fn: (c: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const out = await fn(client);
    await client.query("COMMIT");
    return out;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}
