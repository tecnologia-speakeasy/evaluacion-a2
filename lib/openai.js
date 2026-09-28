// ─────────────────────────────────────────────────────────────────────────────
// Cliente de OpenAI para calificar preguntas abiertas y generar el feedback.
// Reemplaza al flujo de n8n. Incluye reintentos con espera exponencial para
// sobrevivir a los rate limits cuando muchos estudiantes envían a la vez.
// ─────────────────────────────────────────────────────────────────────────────

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Llama a la API de OpenAI pidiendo SIEMPRE una respuesta en JSON.
// Reintenta ante 429 (rate limit) y errores 5xx/red, con backoff exponencial.
async function callOpenAI(messages, { temperature = 0.2, retries = 4 } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Falta la variable de entorno OPENAI_API_KEY");

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(60_000),
      });

      // Rate limit o error del servidor → esperar y reintentar.
      if (resp.status === 429 || resp.status >= 500) {
        lastErr = new Error(`OpenAI respondió ${resp.status}`);
        if (attempt < retries) {
          // Respeta Retry-After si viene; si no, backoff exponencial con jitter.
          const retryAfter = Number(resp.headers.get("retry-after"));
          const wait = Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : Math.min(1500 * 2 ** attempt, 20_000) + attempt * 250;
          await sleep(wait);
          continue;
        }
      }

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`OpenAI ${resp.status}: ${text.slice(0, 300)}`);
      }

      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content ?? "{}";
      return JSON.parse(content);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(Math.min(1500 * 2 ** attempt, 20_000));
        continue;
      }
    }
  }
  throw lastErr ?? new Error("OpenAI: fallo desconocido");
}

// Califica las preguntas ABIERTAS (0–10 cada una) en UNA sola llamada.
// openItems: [{ id, question, answer }]  →  devuelve { [id]: score }
export async function gradeOpenAnswers(openItems) {
  if (!openItems || openItems.length === 0) return {};

  const bloques = openItems
    .map(
      (it) =>
        `ID: ${it.id}\nPregunta: ${it.question}\nRespuesta del alumno: ${
          it.answer?.trim() ? it.answer : "(vacío)"
        }`
    )
    .join("\n\n");

  const out = await callOpenAI([
    {
      role: "system",
      content:
        "Actúa como un profesor de inglés experto que califica respuestas abiertas de un examen.",
    },
    {
      role: "user",
      content: `Califica cada una de las siguientes respuestas abiertas del alumno con un puntaje de 0 a 10, según gramática, coherencia, vocabulario y qué tan bien responde a la pregunta. Una respuesta vacía o irrelevante recibe 0. No asignes siempre el mismo número: calcula el puntaje real de cada una.

${bloques}

Responde EXCLUSIVAMENTE en JSON con esta forma exacta:
{ "resultados": [ { "id": <numero>, "score": <numero entero 0-10> } ] }`,
    },
  ]);

  const map = {};
  const arr = Array.isArray(out?.resultados) ? out.resultados : [];
  for (const r of arr) {
    const id = Number(r?.id);
    const score = Number(r?.score);
    if (Number.isInteger(id) && Number.isFinite(score)) {
      map[id] = Math.max(0, Math.min(10, Math.round(score)));
    }
  }
  return map;
}

// Secciones del examen (por rango de id) para resumir el desempeño sin tener
// que mandarle a la IA las 120 preguntas completas (ahorra ~80% de tokens).
// Deben coincidir con las Parts de lib/exam.js.
const FEEDBACK_SECTIONS = [
  { from: 1, to: 30, nombre: "Opción múltiple (pasado simple, pasado continuo, there was/were, futuro, modales y pronombres)" },
  { from: 31, to: 50, nombre: "Verbos en pasado simple" },
  { from: 51, to: 65, nombre: "Completar oraciones con la forma correcta del verbo" },
  { from: 66, to: 75, nombre: "Pronombres de objeto (me, you, him, her, it, us, them)" },
  { from: 76, to: 85, nombre: "Verbos modales (can, should, must)" },
  { from: 86, to: 95, nombre: "Pronombres reflexivos (myself, yourself, himself…)" },
  { from: 96, to: 105, nombre: "Futuro: will o be going to" },
  { from: 106, to: 120, nombre: "Traducción de oraciones" },
];

// Convierte el detalle de 120 preguntas en un resumen compacto: aciertos por
// sección + unos pocos ejemplos de errores. Esto reduce muchísimo los tokens
// que se envían a la IA (más rápido y aguanta muchas más entregas a la vez).
function resumirResultados(detailedResults) {
  const items = Array.isArray(detailedResults) ? detailedResults : [];
  const idDe = (it) => Number(it.id);
  const acerto = (it) => Number(it.score) > 0;

  const secciones = FEEDBACK_SECTIONS.map((s) => {
    const en = items.filter((it) => idDe(it) >= s.from && idDe(it) <= s.to);
    return { seccion: s.nombre, aciertos: en.filter(acerto).length, total: en.length };
  });

  // Hasta 8 ejemplos de errores para que el feedback sea concreto.
  const errores = items
    .filter((it) => !acerto(it))
    .slice(0, 8)
    .map((it) => ({
      pregunta: it.Pregunta,
      respuesta_alumno: it["Respuesta del alumno"] || "(vacío)",
    }));

  return {
    aciertos_totales: items.filter(acerto).length,
    total_preguntas: items.length,
    desempeno_por_seccion: secciones,
    ejemplos_de_errores: errores,
  };
}

// Genera el feedback pedagógico global a partir de los resultados de las
// preguntas. detailedResults: [{ id, "Pregunta", "Respuesta del alumno", score }]
export async function generateFeedback(detailedResults) {
  const resumen = resumirResultados(detailedResults);

  const out = await callOpenAI(
    [
      {
        role: "system",
        content:
          "Actúa como un profesor avanzado de inglés que acaba de revisar un examen de un estudiante.",
      },
      {
        role: "user",
        content: `Aquí tienes el resumen del desempeño del estudiante (aciertos por sección y algunos ejemplos de errores):

${JSON.stringify(resumen, null, 2)}

Analiza cada pregunta, su respuesta y el score obtenido, e identifica en qué áreas el estudiante es bueno y en qué le falta mejorar. Enfócate en el análisis pedagógico global; no repitas las notas de cada pregunta.

El tono en el que se le dará a este feedback siempre debe ser amable, destacando la fortaleza y luego en lo que debe practicar el estudiante para poder dominar eso que se le dificulta

Nosotros somos un lugar en donde las personas aprenden inglés pero lo más importante es que nuestros estudiantes siempre destacan la calidad humana, la paciencia con la que se les explica, así se trate de un tema sencillo las personas dicen que siempre lo habían escuchado pero que realmente nunca lo habían aprendido, por eso, cuidamos muy bien las palabras con las que damos un retroalimentación porque la idea no es humillar ni hacer sentir mal al estudiante, sino hacer recomendaciones respetuosas, eso si, todo esto sin perder el profesionalismo, sin caer en frases rebuscadas y entendiendo que este es un ejercicio entre profesor y estudiante

Si es necesario dar un ejercicio a un estudiante para que practique, hagámoslo que sea conciso, nosotros priorizamos que el estudiante entienda, luego practique, le damos feedback y le recomendamos que se rodee del idioma en contextos reales por eso tenemos una herramienta en nuestro sistema de estudio y es el Club conversacional, en donde todos los días hay profes conectados hablando en inglés con los estudiantes, dándoles feedback si es necesario y esta puede ser una recomendación si es necesario de acuerdo a las falencias y fortalezas que se puedan evidenciar. 

Y por último hablale al estudiante de manera personal, por ejemplo: en tu evaluación demuestras un buen manejo con el presente simple, eso significa que puedes construir oraciones de tus hobbies, de las cosas que haces todos los días, etc, te recomiendo que practiques con el material de estudio las oraciones negativas con las terceras personas singulares, etc… 

Por último te felicito por haber presentado tu evaluación, eso demuestra el gran interés que le tienes al inglés y quería felicitarte por ello. Un abrazo

El título que dice gracias por intentarlo, cambiemoslo por felicidades y el texto debajo puede ser algo como, te felicitamos por presentar tu evaluación, lo hiciste muy bien. 

Recuerda que no hacemos uso de frases ultra positivas porque deja de sentirse natural la comunicación. 



En cuanto a los ejercicios o recomendaciones que le podemos enviar al estudiante, te voy a dar un ejemplo para que te guies, la idea es que de acuerdo al resultado escojas el tema que más se le dificulto y le hagamos la recomendación, por ejemplo: Te quiero recomendar un ejercicio muy sencillo y que te ayudará a practicar el presente continuo, y es que cada vez que quieras decir que algo está pasando en este momento te preguntes si quieres decir algo que estás haciendo ahora o si es algo que haces en tu rutina diaria, por ejemplo: I study english (eso es tu rutina) pero si te acabas de conectar a tu clase y lo estas haciendo justo ahora sería I am studying english 

Otro ejemplo de ejercicio para el caso de los posesivos: Te quiero recomendar algo super útil  para el uso de los posesivos

En ocasiones en una misma oración tenemos dos sujetos y eso puede generar un duda de a cual sujeto le pongo el posesivo, así que lo tendrás que hacer es preguntarte quién es el dueño de ese objeto y a ese sujeto es el que le pones el posesivo, eso es todo. 

Veamos un ejemplo 

My sister is at the park with her dog.
Mi hermana está en el parque con su perro.
Pregunta:
¿De quién es el perro?
Respuesta:
De mi hermana.
Por eso usamos her.

Responde EXCLUSIVAMENTE en JSON con esta forma exacta:
{ "resumen_desempeño": "<tu análisis aquí, en español>" }`,
      },
    ],
    { temperature: 0.5 }
  );

  return typeof out?.resumen_desempeño === "string"
    ? out.resumen_desempeño
    : null;
}
