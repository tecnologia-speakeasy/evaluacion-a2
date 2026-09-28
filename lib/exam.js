// ─────────────────────────────────────────────────────────────────────────────
// Definición del examen — FUENTE DE VERDAD DEL SERVIDOR.
// Las respuestas correctas viven aquí y NUNCA se envían al navegador.
// La calificación de las preguntas objetivas ocurre en el servidor (/api/submit).
//
// Para añadir/editar preguntas, cambia este archivo. Las cerradas (multiple_choice
// y fill_blank) se califican con 0 o 10 en el servidor.
// ─────────────────────────────────────────────────────────────────────────────

export const POINTS_PER_QUESTION = 10;

const ALL_QUESTIONS = [
  { id: 1, type: "multiple_choice", question: "Canada ______ a very cold country in winter.", correct: "is" },
  { id: 2, type: "multiple_choice", question: "My sister ______ English every night.", correct: "studies" },
  { id: 3, type: "multiple_choice", question: "The dogs ______ in the park right now.", correct: "are running" },
  { id: 4, type: "multiple_choice", question: "Marcos ______ coffee in the morning.", correct: "doesn't drink" },
  { id: 5, type: "multiple_choice", question: "______ Brazil produce good coffee?", correct: "Does" },
  { id: 6, type: "multiple_choice", question: "The baby ______ now.", correct: "is sleeping" },
  { id: 7, type: "multiple_choice", question: "My parents ______ at home today.", correct: "are" },
  { id: 8, type: "multiple_choice", question: "Laura ______ to music in the morning.", correct: "listens" },
  { id: 9, type: "multiple_choice", question: "______ your teacher speak English?", correct: "Does" },
  { id: 10, type: "multiple_choice", question: "Mexico and Colombia ______ beautiful countries.", correct: "are" },
  { id: 11, type: "multiple_choice", question: "Samuel ______ his homework right now.", correct: "is doing" },
  { id: 12, type: "multiple_choice", question: "The cat ______ rice every day.", correct: "doesn't eat" },
  { id: 13, type: "multiple_choice", question: "The bird ______ every morning.", correct: "sings" },
  { id: 14, type: "multiple_choice", question: "______ the students studying now?", correct: "Are" },
  { id: 15, type: "multiple_choice", question: "Germany ______ in Europe.", correct: "is" },
  { id: 16, type: "multiple_choice", question: "My brother ______ soccer on Sundays.", correct: "plays" },
  { id: 17, type: "multiple_choice", question: "Camila and Juan ______ cold weather.", correct: "don't like" },
  { id: 18, type: "multiple_choice", question: "I ______ from Colombia.", correct: "am" },
  { id: 19, type: "multiple_choice", question: "The elephant ______ a lot of water every day.", correct: "drinks" },
  { id: 20, type: "multiple_choice", question: "______ Ana and Pedro watching a movie?", correct: "Are" },
  { id: 21, type: "multiple_choice", question: "My phone ______ on the desk.", correct: "is" },
  { id: 22, type: "multiple_choice", question: "The children ______ in the garden right now.", correct: "are playing" },
  { id: 23, type: "multiple_choice", question: "Japan ______ many cars.", correct: "makes" },
  { id: 24, type: "multiple_choice", question: "I ______ vegetables every day.", correct: "don't eat" },
  { id: 25, type: "multiple_choice", question: "______ the fish swimming in the water?", correct: "Is" },
  { id: 26, type: "multiple_choice", question: "My friends ______ very happy today.", correct: "are" },
  { id: 27, type: "multiple_choice", question: "Sofia ______ her room on Saturdays.", correct: "cleans" },
  { id: 28, type: "multiple_choice", question: "______ your dog sleep in the kitchen?", correct: "Does" },
  { id: 29, type: "multiple_choice", question: "We ______ English at this moment.", correct: "are speaking" },
  { id: 30, type: "multiple_choice", question: "The sun ______ in the morning.", correct: "shines" },
  // ── Part 2 — Possessive Adjectives (completar). accepts: una lista por espacio. ──
  { id: 31, type: "fill_blank", question: "I am doing ______ homework now.", accepts: [["my"]] },
  { id: 32, type: "fill_blank", question: "Sofia doesn't have ______ notebook today.", accepts: [["her"]] },
  { id: 33, type: "fill_blank", question: "Does your brother clean ______ room on Saturdays?", accepts: [["his"]] },
  { id: 34, type: "fill_blank", question: "We are studying English with ______ teacher.", accepts: [["our"]] },
  { id: 35, type: "fill_blank", question: "The dog is eating ______ food in the kitchen.", accepts: [["its"]] },
  { id: 36, type: "fill_blank", question: "Are you talking to ______ mother right now?", accepts: [["your"]] },
  { id: 37, type: "fill_blank", question: "Colombia is famous for ______ coffee.", accepts: [["its"]] },
  { id: 38, type: "fill_blank", question: "My parents don't use ______ car every day.", accepts: [["their"]] },
  { id: 39, type: "fill_blank", question: "Camila is wearing ______ new shoes today.", accepts: [["her"]] },
  { id: 40, type: "fill_blank", question: "Do you and Daniel like ______ English class?", accepts: [["your"]] },
  { id: 41, type: "fill_blank", question: "The students are opening ______ books.", accepts: [["their"]] },
  { id: 42, type: "fill_blank", question: "I don't drink coffee in ______ house.", accepts: [["my"]] },
  { id: 43, type: "fill_blank", question: "Pedro is helping ______ sister with English.", accepts: [["his"]] },
  { id: 44, type: "fill_blank", question: "We don't have ______ notebooks on the table.", accepts: [["our"]] },
  { id: 45, type: "fill_blank", question: "Is Laura reading ______ book in ______ room?", accepts: [["her"], ["her"]] },
  // ── Part 3 — Demonstratives (completar) ──
  { id: 46, type: "fill_blank", question: "______ is my phone here in my hand.", accepts: [["this"]] },
  { id: 47, type: "fill_blank", question: "______ are my books here on my desk.", accepts: [["these"]] },
  { id: 48, type: "fill_blank", question: "Is ______ your backpack over there near the door?", accepts: [["that"]] },
  { id: 49, type: "fill_blank", question: "I don't like ______ shoes over there in the store window.", accepts: [["those"]] },
  { id: 50, type: "fill_blank", question: "______ dog here next to me is very small.", accepts: [["this"]] },
  { id: 51, type: "fill_blank", question: "Are ______ your pencils here on the table?", accepts: [["these"]] },
  { id: 52, type: "fill_blank", question: "______ isn't my chair over there.", accepts: [["that"]] },
  { id: 53, type: "fill_blank", question: "My sister is reading ______ book here.", accepts: [["this"]] },
  { id: 54, type: "fill_blank", question: "______ apples over there are not fresh.", accepts: [["those"]] },
  { id: 55, type: "fill_blank", question: "Do you want ______ sandwich here on my plate?", accepts: [["this"]] },
  { id: 56, type: "fill_blank", question: "______ students here in this classroom are studying right now.", accepts: [["these"]] },
  { id: 57, type: "fill_blank", question: "I don't understand ______ word here in the sentence.", accepts: [["this"]] },
  { id: 58, type: "fill_blank", question: "Are ______ your friends over there?", accepts: [["those"]] },
  { id: 59, type: "fill_blank", question: "______ is not our classroom over there.", accepts: [["that"]] },
  { id: 60, type: "fill_blank", question: "My parents don't use ______ old computers over there.", accepts: [["those"]] },
  // ── Part 4 — Plurals (escribir el plural) ──
  { id: 61, type: "fill_blank", question: "book → ______", accepts: [["books"]] },
  { id: 62, type: "fill_blank", question: "box → ______", accepts: [["boxes"]] },
  { id: 63, type: "fill_blank", question: "city → ______", accepts: [["cities"]] },
  { id: 64, type: "fill_blank", question: "baby → ______", accepts: [["babies"]] },
  { id: 65, type: "fill_blank", question: "bus → ______", accepts: [["buses"]] },
  { id: 66, type: "fill_blank", question: "story → ______", accepts: [["stories"]] },
  { id: 67, type: "fill_blank", question: "tomato → ______", accepts: [["tomatoes"]] },
  { id: 68, type: "fill_blank", question: "potato → ______", accepts: [["potatoes"]] },
  { id: 69, type: "fill_blank", question: "knife → ______", accepts: [["knives"]] },
  { id: 70, type: "fill_blank", question: "leaf → ______", accepts: [["leaves"]] },
  { id: 71, type: "fill_blank", question: "child → ______", accepts: [["children", "kids"]] },
  { id: 72, type: "fill_blank", question: "person → ______", accepts: [["people"]] },
  { id: 73, type: "fill_blank", question: "man → ______", accepts: [["men"]] },
  { id: 74, type: "fill_blank", question: "woman → ______", accepts: [["women"]] },
  { id: 75, type: "fill_blank", question: "foot → ______", accepts: [["feet"]] },
  { id: 76, type: "fill_blank", question: "tooth → ______", accepts: [["teeth"]] },
  { id: 77, type: "fill_blank", question: "mouse → ______", accepts: [["mice"]] },
  { id: 78, type: "fill_blank", question: "country → ______", accepts: [["countries"]] },
  { id: 79, type: "fill_blank", question: "toy → ______", accepts: [["toys"]] },
  { id: 80, type: "fill_blank", question: "family → ______", accepts: [["families"]] },
  // ── Part 5A — There is / There are ((-) negativo, (?) pregunta) ──
  { id: 81, type: "fill_blank", question: "______ a book on the table.", accepts: [["there is"]] },
  { id: 82, type: "fill_blank", question: "______ three chairs in the kitchen.", accepts: [["there are"]] },
  { id: 83, type: "fill_blank", question: "______ any milk in the fridge. (-)", accepts: [["there isn't", "there is not"]] },
  { id: 84, type: "fill_blank", question: "______ two dogs in the park? (?)", accepts: [["are there"]] },
  { id: 85, type: "fill_blank", question: "______ a pencil in my backpack.", accepts: [["there is"]] },
  { id: 86, type: "fill_blank", question: "______ any students in the classroom. (-)", accepts: [["there aren't", "there are not"]] },
  { id: 87, type: "fill_blank", question: "______ a phone on the desk? (?)", accepts: [["is there"]] },
  { id: 88, type: "fill_blank", question: "______ many apples in the bag.", accepts: [["there are"]] },
  { id: 89, type: "fill_blank", question: "______ any water in the bottle. (-)", accepts: [["there isn't", "there is not"]] },
  { id: 90, type: "fill_blank", question: "______ a restaurant near the school? (?)", accepts: [["is there"]] },
  // ── Part 5B — Many / Much ──
  { id: 91, type: "fill_blank", question: "There are ______ books on the shelf.", accepts: [["many"]] },
  { id: 92, type: "fill_blank", question: "There isn't ______ water in the glass.", accepts: [["much"]] },
  { id: 93, type: "fill_blank", question: "Are there ______ students in your class?", accepts: [["many"]] },
  { id: 94, type: "fill_blank", question: "I don't have ______ money today.", accepts: [["much"]] },
  { id: 95, type: "fill_blank", question: "There aren't ______ chairs in the room.", accepts: [["many"]] },
  { id: 96, type: "fill_blank", question: "Does your sister drink ______ coffee?", accepts: [["much"]] },
  { id: 97, type: "fill_blank", question: "There are ______ pencils on the desk.", accepts: [["many"]] },
  { id: 98, type: "fill_blank", question: "We don't eat ______ bread at night.", accepts: [["much"]] },
  { id: 99, type: "fill_blank", question: "Are there ______ apples in the kitchen?", accepts: [["many"]] },
  { id: 100, type: "fill_blank", question: "My brother doesn't drink ______ milk in the morning.", accepts: [["much"]] },
  // ── Part 6 — Translation (escribir la traducción al inglés). accepts: formas válidas. ──
  { id: 101, type: "translation", question: "Mi hermana estudia inglés todos los días.", accepts: ["my sister studies english every day."] },
  { id: 102, type: "translation", question: "Carlos no trabaja los domingos.", accepts: ["carlos doesn't work on sundays.", "carlos does not work on sundays."] },
  { id: 103, type: "translation", question: "¿Tu mamá vive en Colombia?", accepts: ["does your mom live in colombia?"] },
  { id: 104, type: "translation", question: "No hay huevos en la cocina.", accepts: ["there aren't any eggs in the kitchen.", "there are not any eggs in the kitchen.", "there are no eggs in the kitchen."] },
  { id: 105, type: "translation", question: "Maria debería estudiar inglés.", accepts: ["maria should study english."] },
  { id: 106, type: "translation", question: "Hay muchos libros en la mesa.", accepts: ["there are many books on the table."] },
  { id: 107, type: "translation", question: "Necesito comprar un celular, pero no tengo dinero.", accepts: ["i need to buy a phone, but i don't have money.", "i need to buy a phone, but i do not have money."] },
  { id: 108, type: "translation", question: "¿Hay estudiantes en la clase?", accepts: ["are there students in the class?","are there any students in the class?"] },
  { id: 109, type: "translation", question: "Laura está leyendo su libro favorito.", accepts: ["laura is reading her favorite book."] },
  { id: 110, type: "translation", question: "Juan puede viajar con sus amigos, porque su papá tiene mucho dinero.", accepts: ["juan can travel with his friends because his dad has a lot of money.", "juan can travel with his friends, because his dad has a lot of money."] },
  { id: 111, type: "translation", question: "Tú deberías practicar estas palabras en casa.", accepts: ["you should practice these words at home."] },
  { id: 112, type: "translation", question: "Ellos deben limpiar su habitación hoy.", accepts: ["they must clean their room today."] },
  { id: 113, type: "translation", question: "Tú no puedes dormir, tienes que estudiar para el exámen.", accepts: ["you can't sleep. you have to study for the exam.", "you can't sleep, you have to study for the exam.", "you cannot sleep. you have to study for the exam."] },
  { id: 114, type: "translation", question: "¿Sofía quiere aprender inglés?", accepts: ["does sofia want to learn english?"] },
  { id: 115, type: "translation", question: "Los niños en Colombia deben practicar un deporte.", accepts: ["children in colombia must practice a sport.", "kids in colombia must practice a sport."] },
];

// MODO PRUEBAS: solo estas preguntas forman el examen (deben coincidir con
// ACTIVE_QUESTION_IDS de app/components/EnglishExam.jsx). Pon `null` para
// volver a usar el banco completo.
export const ACTIVE_QUESTION_IDS = [1, 2, 31, 61, 101];

export const QUESTIONS = ACTIVE_QUESTION_IDS
  ? ALL_QUESTIONS.filter((q) => ACTIVE_QUESTION_IDS.includes(q.id))
  : ALL_QUESTIONS;

// Normaliza una respuesta para comparar de forma flexible. NO importan:
//  - mayúsculas / minúsculas ni espacios sobrantes
//  - la puntuación (puntos, comas, signos de interrogación, etc.)
//  - la variante del apóstrofe: '  '  ´  ` se tratan todas igual
// Además expande las contracciones negativas, de modo que "doesn't", "doesn´t"
// y "does not" se consideran equivalentes (igual aren't/isn't/don't/can't, …).
const normalize = (s) =>
  String(s ?? "")
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // ignora acentos: Sofía = Sofia, María = Maria
    .replace(/[‘’ʼ´`']/g, "'") // unifica apóstrofes a '
    .replace(/\bcan't\b/g, "can not")
    .replace(/\bcannot\b/g, "can not")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not") // doesn't→does not, isn't→is not, aren't→are not…
    // contracciones escritas SIN apóstrofe (quien no sabe ponerlo): dont, isnt…
    .replace(/\bcant\b/g, "can not")
    .replace(/\bwont\b/g, "will not")
    .replace(/\b(do|does|did|is|are|was|were|has|have|had|could|would|should|must|need)nt\b/g, "$1 not")
    // Sinónimos aceptados (ambas formas valen como correctas):
    .replace(/\bcell ?phone\b/g, "phone") // cellphone / cell phone = phone
    .replace(/\bclean up\b/g, "clean") // clean up = clean
    .replace(/\b(dad|daddy)\b/g, "father") // dad/daddy = father (papá/padre)
    .replace(/\b(mom|mommy|mum|mummy)\b/g, "mother") // mom/mum = mother (mamá/madre)
    .replace(/[.,;:!?¿¡"()]/g, "") // la puntuación no importa
    .replace(/'/g, "") // apóstrofes restantes (posesivos) tampoco importan
    .replace(/\s+/g, " ")
    .trim();

// Califica las preguntas cerradas (multiple_choice + fill_blank) en el servidor.
// - multiple_choice: la respuesta es texto; se compara con q.correct.
// - fill_blank: la respuesta es un array (uno por espacio); q.accepts es una
//   lista de listas (acepta varias formas por espacio). Acierta si TODOS los
//   espacios coinciden.
// Devuelve el puntaje por pregunta { [id]: 0|10 } y el subtotal.
export function gradeObjective(answers) {
  const perQuestion = {};
  let subtotal = 0;

  for (const q of QUESTIONS) {
    if (q.type === "open") continue;

    let isCorrect = false;
    if (q.type === "fill_blank") {
      const given = answers?.[q.id];
      const blanks = q.accepts ?? [];
      isCorrect =
        Array.isArray(given) &&
        blanks.length > 0 &&
        blanks.every((acc, i) => {
          const g = normalize(given[i]);
          return g !== "" && acc.some((a) => normalize(a) === g);
        });
    } else if (q.type === "translation") {
      const given = normalize(answers?.[q.id]);
      isCorrect = given !== "" && (q.accepts ?? []).some((a) => normalize(a) === given);
    } else {
      const given = normalize(answers?.[q.id]);
      isCorrect = given !== "" && normalize(q.correct) === given;
    }

    const score = isCorrect ? POINTS_PER_QUESTION : 0;
    perQuestion[q.id] = score;
    subtotal += score;
  }

  return { perQuestion, subtotal };
}

// Aciertos por categoría a partir del mapa de puntajes { [id]: 0|10 }.
//  - Grammar = opción múltiple (total 30).
//  - Writing = completar + traducción (total 85).
// Devuelve la cantidad de aciertos de cada una (el total es fijo).
export function categoryScores(perQuestion) {
  let grammar = 0;
  let writing = 0;
  for (const q of QUESTIONS) {
    if ((perQuestion?.[q.id] ?? 0) <= 0) continue;
    if (q.type === "multiple_choice") grammar++;
    else if (q.type === "fill_blank" || q.type === "translation") writing++;
  }
  return { grammar, writing };
}

// El examen se reporta sobre 100 (cada pregunta vale lo mismo, 100 / total).
export const MAX_SCORE = 100;
// Convierte el subtotal crudo (aciertos × POINTS_PER_QUESTION) a escala 0–100.
export function scoreOutOf100(subtotal) {
  const rawMax = QUESTIONS.length * POINTS_PER_QUESTION;
  return rawMax > 0 ? Math.round((subtotal / rawMax) * 100) : 0;
}

// Construye el detalle de las preguntas con su puntaje, para guardar/mostrar
// y para alimentar el prompt de feedback.
// scores: { [id]: number }
export function buildDetailedResults(answers, scores) {
  return QUESTIONS.map((q) => ({
    id: String(q.id),
    Pregunta: q.question,
    "Respuesta del alumno": Array.isArray(answers?.[q.id])
      ? answers[q.id].join(", ")
      : answers?.[q.id] ?? "",
    score: scores?.[q.id] ?? 0,
  }));
}
