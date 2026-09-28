import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { buildDetailedResults, gradeObjective } from "@/lib/exam";

export const runtime = "nodejs";

// Devuelve las evaluaciones previas del estudiante (si ya la presentó), para
// mostrarle sus resultados en vez de dejarlo presentar de nuevo.
// - Sin `id`: el detalle del intento más reciente.
// - Con `id`: el detalle de ese intento (debe pertenecer al mismo correo).
// En ambos casos incluye `attempts`: la lista resumida de TODOS sus intentos
// (del más antiguo al más reciente) para el selector "Ver intento N".
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ exists: false }, { status: 400 });
  const requestedId = body?.id != null ? Number(body.id) : null;

  try {
    const { rows: intentos } = await query(
      `SELECT id, puntaje_total, created_at
         FROM evaluaciones
        WHERE lower(trim(email)) = $1
        ORDER BY created_at ASC, id ASC`,
      [email]
    );

    if (intentos.length === 0) {
      return NextResponse.json({ exists: false });
    }

    const attempts = intentos.map((r, i) => ({
      id: r.id,
      numero: i + 1,
      total_score: r.puntaje_total,
      created_at: r.created_at,
    }));

    const target =
      requestedId != null
        ? intentos.find((r) => r.id === requestedId)
        : intentos[intentos.length - 1];
    if (!target) {
      return NextResponse.json({ exists: false, error: "not_found" }, { status: 404 });
    }

    const { rows } = await query(
      `SELECT puntaje_total, feedback, respuestas FROM evaluaciones WHERE id = $1`,
      [target.id]
    );
    const r = rows[0];
    const answers = r.respuestas ?? {};
    // Recalificamos las respuestas guardadas para tener el detalle correcto de
    // TODAS las preguntas (las columnas p1–p10 son legado de 10 preguntas).
    const { perQuestion } = gradeObjective(answers);

    return NextResponse.json({
      exists: true,
      id: target.id,
      total_score: r.puntaje_total,
      feedback: r.feedback,
      detailed_results: buildDetailedResults(answers, perQuestion),
      answers,
      attempts,
    });
  } catch (err) {
    console.error("[/api/mi-evaluacion] Error:", err);
    return NextResponse.json({ exists: false, error: "db_error" }, { status: 503 });
  }
}
