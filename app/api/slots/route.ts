import { NextResponse } from "next/server";
import { getSession } from "@/lib/agenda/auth";
import { listarSlots, citaDeEstudiante } from "@/lib/agenda/booking";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const [slots, cita] = await Promise.all([
    listarSlots(),
    citaDeEstudiante(session.estudianteId),
  ]);
  return NextResponse.json({ slots, cita });
}
