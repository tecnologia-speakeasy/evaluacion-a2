import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { setSession } from "@/lib/agenda/auth";

export const runtime = "nodejs";

const schema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(120),
  email: z.string().trim().toLowerCase().email("Correo inválido"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }
  const { nombre, email } = parsed.data;

  // Autorización: el correo debe existir en estudiantes_autorizados (schema de DATABASE_URL).
  // Normalizamos ambos lados (trim + lower) porque hay correos cargados con
  // mayúsculas o espacios sobrantes.
  const { rows: autorizado } = await query(
    `SELECT id FROM estudiantes_autorizados WHERE lower(trim(email)) = $1 LIMIT 1`,
    [email]
  );
  if (autorizado.length === 0) {
    return NextResponse.json(
      { error: "No estás autorizado para la evaluación. Verifica tu correo." },
      { status: 403 }
    );
  }

  // Upsert del estudiante (guarda el nombre capturado; actualiza si reingresa).
  const { rows: estRows } = await query(
    `INSERT INTO estudiantes (email, nombre)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre
     RETURNING id`,
    [email, nombre]
  );
  const estudianteId = (estRows as unknown as { id: number }[])[0].id;

  await setSession({ estudianteId, email, nombre });
  return NextResponse.json({ ok: true });
}
