import { query } from "@/lib/db";
import { celebracionPorPuntaje } from "@/lib/celebracion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  nombre: string;
  puntaje_total: number;
  feedback: string | null;
};

// Mismo fondo morado con glows que usa la pantalla de feedback dentro de la app.
const INTRO_BG =
  "radial-gradient(circle at 12% 10%, rgba(138,56,245,0.5) 0%, rgba(138,56,245,0) 42%)," +
  "radial-gradient(circle at 88% 90%, rgba(138,56,245,0.55) 0%, rgba(138,56,245,0) 45%)," +
  "#361E55";

// Anillo de progreso (mismo look que el ProgressRing de la app).
function ScoreRing({ score }: { score: number }) {
  const size = 132;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#FF327D"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Puntaje</span>
      </div>
    </div>
  );
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let row: Row | null = null;
  try {
    const result = await query(
      "SELECT nombre, puntaje_total, feedback FROM evaluaciones WHERE token = $1 LIMIT 1",
      [token]
    );
    const rows = (result?.rows ?? []) as unknown as Row[];
    row = rows[0] ?? null;
  } catch {
    row = null;
  }

  if (!row) {
    return (
      <main
        style={{ background: INTRO_BG }}
        className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white"
      >
        <h1 className="text-2xl font-bold">Resultado no encontrado</h1>
        <p className="mt-2 text-white/60">El enlace no es válido o ya no está disponible.</p>
      </main>
    );
  }

  const tier = celebracionPorPuntaje(row.puntaje_total);
  const nombre = row.nombre?.split(" ")[0] ?? "";

  return (
    <main
      style={{
        background: INTRO_BG,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "min(560px, 94vw)",
          maxHeight: "88vh",
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 24,
          padding: "26px 26px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tier.img}
          alt=""
          style={{ width: 110, height: "auto", marginBottom: 10, flexShrink: 0, filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.3))" }}
        />
        <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, margin: 0, flexShrink: 0 }}>{tier.titulo}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", margin: "8px 0 18px", lineHeight: 1.45, flexShrink: 0 }}>
          Hola <strong>{nombre}</strong>, esta es tu retroalimentación de la evaluación de inglés.
        </p>

        <div style={{ marginBottom: 20, flexShrink: 0 }}>
          <ScoreRing score={row.puntaje_total} />
        </div>

        <div
          style={{
            width: "100%",
            textAlign: "left",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 16,
            padding: "18px 20px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              color: "rgba(255,120,180,0.85)",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            Retroalimentación
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 15,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              textAlign: "justify",
              margin: 0,
            }}
          >
            {row.feedback ?? "Evaluación completada."}
          </p>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
        Speak Easy · Házlo fácil con Speak Easy
      </p>
    </main>
  );
}
