// Crea (o actualiza) las tablas en el Postgres definido por DATABASE_URL.
// Uso:  npm run db:setup
//
// Carga las variables de entorno igual que Next.js (.env.local, .env, etc.).

import nextEnv from "@next/env";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "db", "schema.sql");
const sql = readFileSync(schemaPath, "utf8");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("✗ Falta DATABASE_URL (créala en .env.local).");
  process.exit(1);
}

// Schema destino, leído de ?schema=... del DATABASE_URL (por defecto public).
const schemaMatch = /[?&]schema=([^&]+)/.exec(connectionString);
const schema = schemaMatch ? decodeURIComponent(schemaMatch[1]) : "public";

const client = new pg.Client({
  connectionString,
  ssl: /sslmode=require/.test(connectionString)
    ? { rejectUnauthorized: false }
    : false,
});

try {
  console.log("→ Conectando a la base de datos...");
  await client.connect();
  console.log(`→ Usando schema '${schema}'...`);
  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await client.query(`SET search_path TO "${schema}"`);
  console.log("→ Ejecutando schema.sql...");
  await client.query(sql);
  const { rows } = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = 'evaluaciones' ORDER BY ordinal_position",
    [schema]
  );
  console.log(`✓ Tabla '${schema}.evaluaciones' lista. Columnas:`);
  console.log("  " + rows.map((r) => r.column_name).join(", "));
} catch (err) {
  console.error("✗ Error:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
