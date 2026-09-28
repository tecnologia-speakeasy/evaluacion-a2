import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { query } from "@/lib/db";
import { gradeObjective, buildDetailedResults, scoreOutOf100, categoryScores } from "@/lib/exam";
import { generateFeedback } from "@/lib/openai";
import { sendMail, resultadoEmail } from "@/lib/email";
import { enviarWhatsApp } from "@/lib/manychat";

// pg necesita el runtime de Node (no Edge). maxDuration alto porque las dos
// llamadas a OpenAI (con reintentos) pueden tardar. Vercel Pro permite hasta 300s.
export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const name = String(body?.student?.name ?? "").trim();
  const email = String(body?.student?.email ?? "").trim().toLowerCase();
  const answers = body?.answers ?? {};
  // Veces que el estudiante salió de la pestaña durante el examen (anti-trampa).
  const cambiosPestana = Math.max(0, Math.round(Number(body?.tabSwitches)) || 0);
  // Token aleatorio para el enlace público de resultados.
  const token = randomUUID();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Falta el nombre o el correo del estudiante" },
      { status: 400 }
    );
  }

  // Verificar que el correo esté autorizado (defensa contra envíos directos que
  // se salten la validación del front). De paso traemos su manychat_id (WhatsApp)
  // y su puntaje de speaking (cargado manualmente; 0 si aún no lo tiene).
  let manychatId = null;
  let speakingScore = 0;
  try {
    const { rows } = await query(
      `SELECT a.manychat_id, COALESCE(s.score, 0) AS speaking_score
         FROM estudiantes_autorizados a
         LEFT JOIN speaking_scores s ON lower(trim(s.email)) = lower(trim(a.email))
        WHERE lower(trim(a.email)) = $1 LIMIT 1`,
      [email]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Este correo no está autorizado para la evaluación." },
        { status: 403 }
      );
    }
    manychatId = rows[0].manychat_id;
    speakingScore = Number(rows[0].speaking_score) || 0;
  } catch (err) {
    console.error("[/api/submit] Error verificando autorización:", err);
    return NextResponse.json(
      { error: "No se pudo validar el correo. Intenta de nuevo." },
      { status: 503 }
    );
  }

  // Se permite repetir la evaluación: cada intento se guarda como una fila nueva
  // y los demás endpoints (/api/mi-evaluacion, /api/feedback) usan la más reciente.

  // 1. Calificar las preguntas cerradas EN EL SERVIDOR, sin IA.
  const { perQuestion, subtotal } = gradeObjective(answers);
  const scores = { ...perQuestion }; // { id: 0|10 } (para el feedback)
  // Total sobre 100 (cada pregunta vale lo mismo: 100 / nº de preguntas).
  const finalTotal = scoreOutOf100(subtotal);
  // Aciertos por categoría (Grammar /30, Writing /85) para guardarlos y reportes.
  const { grammar: grammarScore, writing: writingScore } = categoryScores(perQuestion);

  // 2. Guardar de inmediato en Postgres (estado 'pendiente'). Si la IA falla
  //    después, las respuestas ya quedaron a salvo: cero pérdida de datos.
  //    Las respuestas crudas van en `respuestas` (JSONB), no en columnas por pregunta.
  let id;
  try {
    const insert = await query(
      `INSERT INTO evaluaciones
         (nombre, email, puntaje_total, respuestas, cambios_pestana, token, estado, writing_score, grammar_score)
       VALUES ($1, $2, $3, $4, $5, $6, 'pendiente', $7, $8)
       RETURNING id`,
      [name, email, finalTotal, JSON.stringify(answers), cambiosPestana, token, writingScore, grammarScore]
    );
    id = insert.rows[0].id;
  } catch (err) {
    console.error("[/api/submit] Error guardando en Postgres:", err);
    return NextResponse.json(
      { error: "No se pudo guardar la evaluación. Intenta de nuevo." },
      { status: 500 }
    );
  }

  // 3. Generar el feedback con OpenAI (1 llamada), con los puntajes de las cerradas.
  let aiFailed = false;
  const detailedResults = buildDetailedResults(answers, scores);
  let feedbackText = null;
  try {
    feedbackText = await generateFeedback(detailedResults);
  } catch (err) {
    aiFailed = true;
    console.error("[/api/submit] Error generando feedback:", err);
  }

  // 4. Actualizar la fila con el feedback. Si la IA aún NO respondió (saturación
  //    o demora), queda en 'pendiente': NO se guarda nada genérico y el front
  //    pedirá el feedback a /api/feedback (sigue cargando hasta que esté listo).
  try {
    await query(
      `UPDATE evaluaciones
         SET feedback = $1, estado = $2, completed_at = now()
       WHERE id = $3`,
      [feedbackText, aiFailed ? "pendiente" : "listo", id]
    );
  } catch (err) {
    console.error("[/api/submit] Error actualizando la evaluación:", err);
  }

  // 7-8. Correo + WhatsApp SOLO cuando el feedback ya está listo. Si quedó
  //      pendiente, /api/feedback los enviará al generar el feedback (evita
  //      mandar un correo "genérico" que después habría que corregir).
  if (!aiFailed && feedbackText) {
    try {
      const { subject, html, text } = resultadoEmail(name, finalTotal, feedbackText);
      await sendMail({ to: email, subject, html, text });
      await query("UPDATE evaluaciones SET email_enviado = true WHERE id = $1", [id]);
    } catch (err) {
      console.error("[/api/submit] No se pudo enviar el correo de resultado:", err);
    }

    if (manychatId && process.env.MANYCHAT_FLOW_RESULTADO) {
      try {
        await enviarWhatsApp(String(manychatId), process.env.MANYCHAT_FLOW_RESULTADO, {
          se_puntaje: finalTotal, // número (el custom field es de tipo Número)
          // El botón de URL de la plantilla usa el campo "feedback" como sufijo:
          // queda https://.../resultado/<token>
          feedback: token,
        });
      } catch (err) {
        console.error("[/api/submit] WhatsApp (ManyChat) falló:", err);
      }
    }
  }

  // 9. Responder al estudiante. Si el feedback no está listo, va null y el
  //    front lo espera con /api/feedback (sin mostrar nada genérico).
  return NextResponse.json({
    id,
    total_score: finalTotal,
    objective_subtotal: subtotal,
    global_report: { resumen_desempeño: feedbackText ?? null },
    detailed_results: detailedResults,
    speaking_score: speakingScore,
    ai_failed: aiFailed,
  });
}
