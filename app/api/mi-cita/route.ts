import { NextResponse } from "next/server";
import { getSession } from "@/lib/agenda/auth";
import { citaDeEstudiante } from "@/lib/agenda/booking";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const cita = await citaDeEstudiante(session.estudianteId);
  return NextResponse.json({ cita });
}
