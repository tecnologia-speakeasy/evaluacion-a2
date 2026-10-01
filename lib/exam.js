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
  // ── Part 1 — Multiple Choice ──
  { id: 1, type: "multiple_choice", question: "Carlos ______ at home yesterday.", correct: "was" },
  { id: 2, type: "multiple_choice", question: "My friends ______ watching a movie when I called them.", correct: "were" },
  { id: 3, type: "multiple_choice", question: "There ______ many people at the supermarket last night.", correct: "were" },
  { id: 4, type: "multiple_choice", question: "I think Sofia ______ call you tomorrow.", correct: "will" },
  { id: 5, type: "multiple_choice", question: "Daniel ______ to work by bus yesterday.", correct: "went" },
  { id: 6, type: "multiple_choice", question: "My sister ______ studying when my mom arrived.", correct: "was" },
  { id: 7, type: "multiple_choice", question: "______ there any milk in the fridge yesterday?", correct: "Was" },
  { id: 8, type: "multiple_choice", question: "They ______ visit their grandparents next weekend.", correct: "are going to" },
  { id: 9, type: "multiple_choice", question: "Laura didn’t ______ dinner at home last night.", correct: "eat" },
  { id: 10, type: "multiple_choice", question: "My brother can help ______ with your homework.", correct: "you" },
  { id: 11, type: "multiple_choice", question: "The children ______ happy after the class.", correct: "were" },
  { id: 12, type: "multiple_choice", question: "We ______ soccer when it started to rain.", correct: "were playing" },
  { id: 13, type: "multiple_choice", question: "There ______ a big dog in front of the house.", correct: "was" },
  { id: 14, type: "multiple_choice", question: "Maria ______ travel to Canada next year.", correct: "is going to" },
  { id: 15, type: "multiple_choice", question: "Did your teacher ______ the lesson again?", correct: "explain" },
  { id: 16, type: "multiple_choice", question: "You should ______ more water.", correct: "drink" },
  { id: 17, type: "multiple_choice", question: "The cat cleaned ______ after eating.", correct: "itself" },
  { id: 18, type: "multiple_choice", question: "Colombia ______ play against Brazil next month.", correct: "will" },
  { id: 19, type: "multiple_choice", question: "My parents didn’t ______ TV yesterday.", correct: "watch" },
  { id: 20, type: "multiple_choice", question: "Samuel and I ______ at school last Friday.", correct: "were" },
  { id: 21, type: "multiple_choice", question: "______ you studying English at 8 p.m.?", correct: "Were" },
  { id: 22, type: "multiple_choice", question: "There weren’t ______ chairs in the classroom.", correct: "any" },
  { id: 23, type: "multiple_choice", question: "My sister must ______ her room today.", correct: "clean" },
  { id: 24, type: "multiple_choice", question: "I saw Pedro, but he didn’t see ______.", correct: "me" },
  { id: 25, type: "multiple_choice", question: "The students ______ a test yesterday.", correct: "had" },
  { id: 26, type: "multiple_choice", question: "______ there a restaurant near the hotel?", correct: "Was" },
  { id: 27, type: "multiple_choice", question: "Camila is going to ______ English tonight.", correct: "study" },
  { id: 28, type: "multiple_choice", question: "They hurt ______ during the game.", correct: "themselves" },
  { id: 29, type: "multiple_choice", question: "We ______ buy a new computer next month.", correct: "will" },
  { id: 30, type: "multiple_choice", question: "Did Mariana ______ her homework yesterday?", correct: "finish" },
  // ── Part 2 — Past Simple Verbs (escribir el pasado). accepts: una lista por espacio. ──
  { id: 31, type: "fill_blank", question: "go → ______", accepts: [["went"]] },
  { id: 32, type: "fill_blank", question: "clean → ______", accepts: [["cleaned"]] },
  { id: 33, type: "fill_blank", question: "eat → ______", accepts: [["ate"]] },
  { id: 34, type: "fill_blank", question: "study → ______", accepts: [["studied"]] },
  { id: 35, type: "fill_blank", question: "have → ______", accepts: [["had"]] },
  { id: 36, type: "fill_blank", question: "watch → ______", accepts: [["watched"]] },
  { id: 37, type: "fill_blank", question: "see → ______", accepts: [["saw"]] },
  { id: 38, type: "fill_blank", question: "live → ______", accepts: [["lived"]] },
  { id: 39, type: "fill_blank", question: "buy → ______", accepts: [["bought"]] },
  { id: 40, type: "fill_blank", question: "visit → ______", accepts: [["visited"]] },
  { id: 41, type: "fill_blank", question: "take → ______", accepts: [["took"]] },
  { id: 42, type: "fill_blank", question: "call → ______", accepts: [["called"]] },
  { id: 43, type: "fill_blank", question: "make → ______", accepts: [["made"]] },
  { id: 44, type: "fill_blank", question: "play → ______", accepts: [["played"]] },
  { id: 45, type: "fill_blank", question: "come → ______", accepts: [["came"]] },
  { id: 46, type: "fill_blank", question: "need → ______", accepts: [["needed"]] },
  { id: 47, type: "fill_blank", question: "drink → ______", accepts: [["drank"]] },
  { id: 48, type: "fill_blank", question: "work → ______", accepts: [["worked"]] },
  { id: 49, type: "fill_blank", question: "write → ______", accepts: [["wrote"]] },
  { id: 50, type: "fill_blank", question: "travel → ______", accepts: [["traveled", "travelled"]] },
  // ── Part 3 — Complete the Sentences (hint = verbo entre paréntesis; (-) negativo) ──
  { id: 51, type: "fill_blank", question: "My mom ______ very tired yesterday.", hint: "(be)", accepts: [["was"]] },
  { id: 52, type: "fill_blank", question: "The kids ______ in the park when it started to rain.", hint: "(play)", accepts: [["were playing"]] },
  { id: 53, type: "fill_blank", question: "There ______ many books on the table last night.", hint: "(be)", accepts: [["were"]] },
  { id: 54, type: "fill_blank", question: "I ______ my friend after class yesterday.", hint: "(call)", accepts: [["called"]] },
  { id: 55, type: "fill_blank", question: "Daniel didn’t ______ to the gym last weekend.", hint: "(go)", accepts: [["go"]] },
  { id: 56, type: "fill_blank", question: "Sofia ______ dinner when her dad arrived.", hint: "(cook)", accepts: [["was cooking"]] },
  { id: 57, type: "fill_blank", question: "We ______ at home last Sunday.", hint: "(be)", accepts: [["were"]] },
  { id: 58, type: "fill_blank", question: "There ______ any students in the room yesterday. (-)", hint: "(be)", accepts: [["weren’t", "were not"]] },
  { id: 59, type: "fill_blank", question: "My brother ______ his phone yesterday.", hint: "(lose)", accepts: [["lost"]] },
  { id: 60, type: "fill_blank", question: "They ______ visit their family tomorrow.", hint: "(be going to)", accepts: [["are going to", "’re going to"]] },
  { id: 61, type: "fill_blank", question: "Carlos ______ his keys yesterday.", hint: "(lose)", accepts: [["lost"]] },
  { id: 62, type: "fill_blank", question: "I ______ working when you called me.", hint: "(be)", accepts: [["was"]] },
  { id: 63, type: "fill_blank", question: "Laura ______ coffee this morning.", hint: "(drink)", accepts: [["drank"]] },
  { id: 64, type: "fill_blank", question: "There ______ a problem with my phone last night.", hint: "(be)", accepts: [["was"]] },
  { id: 65, type: "fill_blank", question: "My friends ______ a movie next Friday.", hint: "(will / watch)", accepts: [["will watch", "’ll watch"]] },
  // ── Part 4 — Object Pronouns ──
  { id: 66, type: "fill_blank", question: "This exercise is difficult. I don’t understand ______.", accepts: [["it"]] },
  { id: 67, type: "fill_blank", question: "Laura is my friend. I always help ______ with English.", accepts: [["her"]] },
  { id: 68, type: "fill_blank", question: "Pedro is calling you. Please answer ______.", accepts: [["him"]] },
  { id: 69, type: "fill_blank", question: "My parents are at the door. Can you see ______?", accepts: [["them"]] },
  { id: 70, type: "fill_blank", question: "We are lost. Can you help ______?", accepts: [["us"]] },
  { id: 71, type: "fill_blank", question: "I need your number. Can you send ______ a message?", accepts: [["me"]] },
  { id: 72, type: "fill_blank", question: "That dog is very friendly. I like ______.", accepts: [["it"]] },
  { id: 73, type: "fill_blank", question: "Daniel doesn’t know the answer. The teacher is helping ______.", accepts: [["him"]] },
  { id: 74, type: "fill_blank", question: "These exercises are difficult. I don’t understand ______.", accepts: [["them"]] },
  { id: 75, type: "fill_blank", question: "You are speaking too fast. I can’t understand ______.", accepts: [["you"]] },
  // ── Part 5 — Modal Verbs (can / should / must) ──
  { id: 76, type: "fill_blank", question: "You ______ study for the exam. The exam is tomorrow, and you need a good grade.", accepts: [["should"]] },
  { id: 77, type: "fill_blank", question: "My sister ______ speak English very well.", accepts: [["can"]] },
  { id: 78, type: "fill_blank", question: "Students ______ turn off their phones during the exam. It is a school rule.", accepts: [["must"]] },
  { id: 79, type: "fill_blank", question: "You ______ drink more water. It is good for your health.", accepts: [["should"]] },
  { id: 80, type: "fill_blank", question: "Carlos ______ play the guitar, but he can’t sing.", accepts: [["can"]] },
  { id: 81, type: "fill_blank", question: "We ______ be quiet in the library. It is not allowed to make noise there.", accepts: [["must"]] },
  { id: 82, type: "fill_blank", question: "You ______ practice every day if you want to improve your English.", accepts: [["should"]] },
  { id: 83, type: "fill_blank", question: "I ______ help you after class. I have free time today.", accepts: [["can"]] },
  { id: 84, type: "fill_blank", question: "They ______ clean their room today. Their mom said it is necessary.", accepts: [["must"]] },
  { id: 85, type: "fill_blank", question: "She ______ visit a doctor because she feels sick.", accepts: [["should"]] },
  // ── Part 6 — Reflexive Pronouns ──
  { id: 86, type: "fill_blank", question: "I prepared the presentation by ______.", accepts: [["myself"]] },
  { id: 87, type: "fill_blank", question: "Sofia looked at ______ in the mirror.", accepts: [["herself"]] },
  { id: 88, type: "fill_blank", question: "Carlos hurt ______ during the soccer game.", accepts: [["himself"]] },
  { id: 89, type: "fill_blank", question: "The children dressed ______ for school.", accepts: [["themselves"]] },
  { id: 90, type: "fill_blank", question: "We did the project by ____________.", accepts: [["ourselves"]] },
  { id: 91, type: "fill_blank", question: "Did you make this cake by ______?", accepts: [["yourself"]] },
  { id: 92, type: "fill_blank", question: "The cat cleaned ______ after eating.", accepts: [["itself"]] },
  { id: 93, type: "fill_blank", question: "You and your brother should prepare ______ for the test.", accepts: [["yourselves"]] },
  { id: 94, type: "fill_blank", question: "I don’t want to repeat ______ again.", accepts: [["myself"]] },
  { id: 95, type: "fill_blank", question: "My parents introduced ______ to the new teacher.", accepts: [["themselves"]] },
  // ── Part 7 — Future Form (will / be going to) ──
  { id: 96, type: "fill_blank", question: "Look at those clouds. It ______ rain.", accepts: [["is going to", "’s going to"]] },
  { id: 97, type: "fill_blank", question: "I think Colombia ______ win the game.", accepts: [["will", "’ll"]] },
  { id: 98, type: "fill_blank", question: "We ______ visit my grandmother this weekend. We already have the tickets.", accepts: [["are going to", "’re going to"]] },
  { id: 99, type: "fill_blank", question: "She is tired. She ______ bed early tonight.", accepts: [["is going to", "’s going to"]] },
  { id: 100, type: "fill_blank", question: "Maybe I ______ study medicine in the future.", accepts: [["will", "’ll"]] },
  { id: 101, type: "fill_blank", question: "They bought food and drinks. They ______ have a party.", accepts: [["are going to", "’re going to"]] },
  { id: 102, type: "fill_blank", question: "I’m sure you ______ like this movie.", accepts: [["will", "’ll"]] },
  { id: 103, type: "fill_blank", question: "He has a plane ticket. He ______ travel tomorrow.", accepts: [["is going to", "’s going to"]] },
  { id: 104, type: "fill_blank", question: "Don’t worry. I ______ help you.", accepts: [["will", "’ll"]] },
  { id: 105, type: "fill_blank", question: "My sister is pregnant. She ______ have her baby soon.", accepts: [["is going to", "’s going to"]] },
  // ── Part 8 — Translation (escribir la traducción al inglés). accepts: formas válidas. ──
  { id: 106, type: "translation", question: "Yo estaba en la casa ayer.", accepts: ["I was at home yesterday.", "I was in the house yesterday."] },
  { id: 107, type: "translation", question: "Mi hermana no fue al colegio el lunes.", accepts: ["My sister didn’t go to school on Monday.", "My sister did not go to school on Monday.", "My sister wasn’t at school on Monday.", "My sister was not at school on Monday."] },
  { id: 108, type: "translation", question: "¿Había muchos estudiantes en la clase?", accepts: ["Were there many students in the class?", "Were there a lot of students in the class?", "Were there many students in the classroom?", "Were there a lot of students in the classroom?"] },
  { id: 109, type: "translation", question: "Carlos estaba viendo televisión cuando su mamá llegó.", accepts: ["Carlos was watching TV when his mom arrived.", "Carlos was watching television when his mom arrived.", "Carlos was watching TV when his mother arrived.", "Carlos was watching television when his mother arrived.", "Carlos was watching TV when his mom came.", "Carlos was watching television when his mom came.", "Carlos was watching TV when his mother came.", "Carlos was watching television when his mother came.", "Carlos was watching TV when his mom got home.", "Carlos was watching television when his mom got home.", "Carlos was watching TV when his mother got home.", "Carlos was watching television when his mother got home."] },
  { id: 110, type: "translation", question: "Nosotros vamos a estudiar inglés esta noche.", accepts: ["We are going to study English tonight.", "We’re going to study English tonight."] },
  { id: 111, type: "translation", question: "No había agua en la botella.", accepts: ["There wasn’t any water in the bottle.", "There was not any water in the bottle.", "There was no water in the bottle."] },
  { id: 112, type: "translation", question: "Laura no compró comida ayer.", accepts: ["Laura didn’t buy food yesterday.", "Laura did not buy food yesterday.", "Laura didn’t buy any food yesterday.", "Laura did not buy any food yesterday."] },
  { id: 113, type: "translation", question: "¿Tu hermano puede ayudarme con esta tarea?", accepts: ["Can your brother help me with this homework?", "Can your brother help me with this task?", "Can your brother help me with this assignment?"] },
  { id: 114, type: "translation", question: "Ellos deben limpiar su habitación hoy.", accepts: ["They must clean their room today.", "They have to clean their room today."] },
  { id: 115, type: "translation", question: "Tú deberías practicar inglés todos los días.", accepts: ["You should practice English every day.", "You should practise English every day."] },
  { id: 116, type: "translation", question: "María se lastimó mientras estaba cocinando.", accepts: ["Maria hurt herself while she was cooking.", "María hurt herself while she was cooking.", "Maria injured herself while she was cooking.", "María injured herself while she was cooking."] },
  { id: 117, type: "translation", question: "Yo los vi en el supermercado.", accepts: ["I saw them at the supermarket.", "I saw them in the supermarket."] },
  { id: 118, type: "translation", question: "Mis amigos viajarán a México el próximo año.", accepts: ["My friends will travel to Mexico next year.", "My friends’ll travel to Mexico next year.", "My friends will go to Mexico next year.", "My friends’ll go to Mexico next year."] },
  { id: 119, type: "translation", question: "¿Estabas trabajando ayer?", accepts: ["Were you working yesterday?"] },
  { id: 120, type: "translation", question: "Sofía quería aprender a cocinar.", accepts: ["Sofia wanted to learn to cook.", "Sofía wanted to learn to cook.", "Sofia wanted to learn how to cook.", "Sofía wanted to learn how to cook."] },
];

// MODO PRUEBAS: solo estas preguntas forman el examen (deben coincidir con
// ACTIVE_QUESTION_IDS de app/components/EnglishExam.jsx). Pon `null` para
// volver a usar el banco completo.
export const ACTIVE_QUESTION_IDS = null;

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
//  - Writing = completar + traducción (total 90).
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
    // Incluye la pista (ej. "(be)") para que la IA entienda qué se pedía.
    Pregunta: q.hint ? `${q.question} ${q.hint}` : q.question,
    "Respuesta del alumno": Array.isArray(answers?.[q.id])
      ? answers[q.id].join(", ")
      : answers?.[q.id] ?? "",
    score: scores?.[q.id] ?? 0,
  }));
}
