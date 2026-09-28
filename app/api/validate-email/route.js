import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

// Valida si un correo está en la lista blanca de estudiantes autorizados.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ authorized: false }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ authorized: false }, { status: 400 });
  }

  try {
    const { rows } = await query(
      "SELECT 1 FROM estudiantes_autorizados WHERE lower(trim(email)) = $1 LIMIT 1",
      [email]
    );
    return NextResponse.json({ authorized: rows.length > 0 });
  } catch (err) {
    console.error("[/api/validate-email] Error:", err);
    // Ante error de base de datos devolvemos 503 para que el front lo distinga
    // de "no autorizado" y muestre "intenta de nuevo".
    return NextResponse.json(
      { authorized: false, error: "db_error" },
      { status: 503 }
    );
  }
}
