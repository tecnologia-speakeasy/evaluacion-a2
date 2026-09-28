import pg from "pg";

const { Client } = pg;

// ─────────────────────────────────────────────────────────────────────────────
// Acceso a Postgres optimizado para serverless contra un Postgres con pocas
// conexiones (VPS, max_connections=100).
//
// Estrategia: conexión EFÍMERA. Cada query abre una conexión, ejecuta y la
// CIERRA de inmediato. Así una conexión vive ~50ms (lo que dura la query) y
// NUNCA se queda retenida durante los 10–30s que tardan las llamadas a OpenAI.
//
// Schema: las tablas viven en el schema indicado por ?schema=... del DATABASE_URL
// (p.ej. ?schema=agendamiento). Se aplica vía search_path en cada conexión.
// ─────────────────────────────────────────────────────────────────────────────

// Lee el schema del parámetro ?schema=... del DATABASE_URL (por defecto public).
function schemaFromUrl(connectionString) {
  const m = /[?&]schema=([^&]+)/.exec(connectionString || "");
  return m ? decodeURIComponent(m[1]) : "public";
}

function makeClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Falta la variable de entorno DATABASE_URL");
  }
  const schema = schemaFromUrl(connectionString);
  return new Client({
    connectionString,
    // Apunta las consultas (tablas sin prefijo) al schema correcto.
    options: `-c search_path=${schema},public`,
    connectionTimeoutMillis: 10_000,
    // SSL solo si la URL lo pide (sslmode=require).
    ssl: /sslmode=require/.test(connectionString)
      ? { rejectUnauthorized: false }
      : false,
  });
}

export async function query(text, params) {
  const client = makeClient();
  await client.connect();
  try {
    return await client.query(text, params);
  } finally {
    // Cierra la conexión pase lo que pase, liberando el cupo del VPS de inmediato.
    await client.end().catch(() => {});
  }
}
