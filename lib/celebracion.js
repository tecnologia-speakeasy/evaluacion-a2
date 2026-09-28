// Rangos de calificación de la pantalla de resultado: cada rango cambia la
// imagen y el texto según el puntaje (0–100). Se evalúa de menor a mayor: gana
// el primer rango cuyo `hasta` cubra el puntaje (límite superior INCLUIDO).
//
// Compartido por la pantalla de fin de examen (EnglishExam.jsx) y la página de
// resultado que abre el botón de WhatsApp (/resultado/[token]), para que ambas
// se vean idénticas.
export const CELEBRATION_TIERS = [
  {
    hasta: 20, // 0 a 20 (incluye 20)
    img: "/calificaciones/20.png",
    titulo: "¡Gracias por intentarlo!",
    sub: "Sabemos que ha sido un camino largo, pero con esfuerzo tendrás mejores resultados.",
  },
  {
    hasta: 50, // 21 a 50
    img: "/calificaciones/50.png",
    titulo: "¡Gracias por intentarlo!",
    sub: "Sabemos que ha sido un camino largo, pero con esfuerzo tendrás mejores resultados.",
  },
  {
    hasta: 60, // 51 a 60
    img: "/calificaciones/60.png",
    titulo: "¡Gracias por intentarlo!",
    sub: "Sabemos que ha sido un camino largo, pero con esfuerzo tendrás mejores resultados.",
  },
  {
    hasta: 70, // 61 a 70
    img: "/calificaciones/70.png",
    titulo: "¡Gracias por intentarlo!",
    sub: "Sabemos que ha sido un camino largo, pero con esfuerzo tendrás mejores resultados.",
  },
  {
    hasta: 80, // 71 a 80
    img: "/calificaciones/80.png",
    titulo: "¡Lo estás haciendo bien!",
    sub: "Sabemos que ha sido un camino largo, y con esfuerzo seguirás mejorando.",
  },
  {
    hasta: 90, // 81 a 90
    img: "/calificaciones/90.png",
    titulo: "¡Felicitaciones!",
    sub: "Sabemos que ha sido un camino largo, pero tu esfuerzo ha dado frutos",
  },
  {
    hasta: 100, // 91 a 100
    img: "/calificaciones/100.png",
    titulo: "¡Felicitaciones!",
    sub: "Sabemos que ha sido un camino largo, pero tu esfuerzo ha dado frutos",
  },
];

// Fallback por si el puntaje llega vacío o fuera de rango.
export const CELEBRATION_DEFAULT = {
  img: "/TROFEO.png",
  titulo: "¡Felicitaciones!",
  sub: "Sabemos que ha sido un camino largo, pero tu esfuerzo ha dado frutos",
};

export function celebracionPorPuntaje(score) {
  const n = typeof score === "number" ? score : Number(score);
  if (Number.isFinite(n)) {
    for (const t of CELEBRATION_TIERS) {
      if (n <= t.hasta) return t;
    }
  }
  return CELEBRATION_DEFAULT;
}
