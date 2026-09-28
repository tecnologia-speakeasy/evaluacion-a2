import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { gradeObjective, buildDetailedResults } from "@/lib/exam";
import { generateFeedback } from "@/lib/openai";
import { sendMail, resultadoEmail } from "@/lib/email";
import { enviarWhatsApp } from "@/lib/manychat";

// pg necesita Node. maxDuration alto porque puede esperar a la IA (con reintentos).
export const runtime = "nodejs";
export const maxDuration = 120;

// Genera (o devuelve, si ya existe) el feedback de IA de la evaluación de un
// estudiante. El front llama a este endpoint en bucle tras enviar el examen:
// mientras la IA esté saturada devuelve { ready:false } y la pantalla sigue
// "cargando"; cuando responde, devuelve { ready:true, feedback, ... }.
// Así nunca se muestra un feedback genérico por una demora.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ready: false }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ ready: false }, { status: 400 });

  // Evaluación más reciente del estudiante.
  let row;
  try {
    const { rows } = await query(
      `SELECT id, nombre, email, token, puntaje_total, respuestas, feedback, email_enviado
         FROM evaluaciones
        WHERE lower(trim(email)) = $1
        ORDER BY created_at DESC
        LIMIT 1`,
      [email]
    );
    row = rows[0];
  } catch (err) {
    console.error("[/api/feedback] Error consultando la evaluación:", err);
    return NextResponse.json({ ready: false }, { status: 503 });
  }

  // No hay evaluación para ese correo (no se alcanzó a guardar): el front
  // distinguirá esto para no quedarse cargando para siempre.
  if (!row) return NextResponse.json({ ready: false, notFound: true }, { status: 404 });

  const answers = row.respuestas ?? {};
  const { perQuestion } = gradeObjective(answers);
  const detailed = buildDetailedResults(answers, perQuestion);

  // Puntaje de speaking (cargado manualmente; 0 si aún no lo tiene).
  let speakingScore = 0;
  try {
    const sp = await query(
      "SELECT COALESCE(score, 0) AS s FROM speaking_scores WHERE lower(trim(email)) = $1 LIMIT 1",
      [email]
    );
    speakingScore = Number(sp.rows[0]?.s) || 0;
  } catch (err) {
    console.error("[/api/feedback] Error consultando speaking:", err);
  }

  // Si ya hay feedback guardado, lo devolvemos tal cual.
  if (row.feedback) {
    return NextResponse.json({
      ready: true,
      feedback: row.feedback,
      total_score: row.puntaje_total,
      detailed_results: detailed,
      speaking_score: speakingScore,
    });
  }

  // Intentar generar el feedback. generateFeedback ya reintenta ante saturación;
  // si aun así no responde, devolvemos ready:false y el front vuelve a pedir.
  let feedbackText = null;
  try {
    feedbackText = await generateFeedback(detailed);
  } catch (err) {
    console.error("[/api/feedback] IA no disponible todavía:", err);
    return NextResponse.json({ ready: false });
  }
  if (!feedbackText) return NextResponse.json({ ready: false });

  // Guardar el feedback.
  try {
    await query(
      `UPDATE evaluaciones SET feedback = $1, estado = 'listo', completed_at = now() WHERE id = $2`,
      [feedbackText, row.id]
    );
  } catch (err) {
    console.error("[/api/feedback] Error guardando el feedback:", err);
  }

  // Correo + WhatsApp (solo si no se han enviado todavía).
  if (!row.email_enviado) {
    try {
      const { subject, html, text } = resultadoEmail(row.nombre, row.puntaje_total, feedbackText);
      await sendMail({ to: row.email, subject, html, text });
      await query("UPDATE evaluaciones SET email_enviado = true WHERE id = $1", [row.id]);
    } catch (err) {
      console.error("[/api/feedback] No se pudo enviar el correo:", err);
    }

    if (process.env.MANYCHAT_FLOW_RESULTADO) {
      try {
        const { rows } = await query(
          `SELECT manychat_id FROM estudiantes_autorizados WHERE lower(trim(email)) = $1 LIMIT 1`,
          [email]
        );
        const mcId = rows[0]?.manychat_id;
        if (mcId) {
          await enviarWhatsApp(String(mcId), process.env.MANYCHAT_FLOW_RESULTADO, {
            se_puntaje: row.puntaje_total,
            feedback: row.token,
          });
        }
      } catch (err) {
        console.error("[/api/feedback] WhatsApp (ManyChat) falló:", err);
      }
    }
  }

  return NextResponse.json({
    ready: true,
    feedback: feedbackText,
    total_score: row.puntaje_total,
    detailed_results: detailed,
    speaking_score: speakingScore,
  });
}
