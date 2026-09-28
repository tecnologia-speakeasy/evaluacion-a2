import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { buildDetailedResults, gradeObjective } from "@/lib/exam";

export const runtime = "nodejs";

// Devuelve la evaluación previa del estudiante (si ya la presentó), para
// mostrarle sus resultados en vez de dejarlo presentar de nuevo.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ exists: false }, { status: 400 });

  try {
    const { rows } = await query(
      `SELECT puntaje_total, feedback, respuestas
       FROM evaluaciones
       WHERE lower(trim(email)) = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ exists: false });
    }

    const r = rows[0];
    const answers = r.respuestas ?? {};
    // Recalificamos las respuestas guardadas para tener el detalle correcto de
    // TODAS las preguntas (las columnas p1–p10 son legado de 10 preguntas).
    const { perQuestion } = gradeObjective(answers);

    return NextResponse.json({
      exists: true,
      total_score: r.puntaje_total,
      feedback: r.feedback,
      detailed_results: buildDetailedResults(answers, perQuestion),
      answers,
    });
  } catch (err) {
    console.error("[/api/mi-evaluacion] Error:", err);
    return NextResponse.json({ exists: false, error: "db_error" }, { status: 503 });
  }
}
