"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { celebracionPorPuntaje } from "@/lib/celebracion";

// ─── Exam Data ────────────────────────────────────────────────────────────────
const ALL_EXAM_QUESTIONS = [
  // ── Part 1 — Multiple Choice ──
  { id: 1, type: "multiple_choice", question: "Carlos ______ at home yesterday.",
    options: ["were", "was", "is", "be"], correct: "was" },
  { id: 2, type: "multiple_choice", question: "My friends ______ watching a movie when I called them.",
    options: ["was", "were", "are", "did"], correct: "were" },
  { id: 3, type: "multiple_choice", question: "There ______ many people at the supermarket last night.",
    options: ["was", "were", "is", "are"], correct: "were" },
  { id: 4, type: "multiple_choice", question: "I think Sofia ______ call you tomorrow.",
    options: ["is", "was", "will", "did"], correct: "will" },
  { id: 5, type: "multiple_choice", question: "Daniel ______ to work by bus yesterday.",
    options: ["go", "goes", "went", "going"], correct: "went" },
  { id: 6, type: "multiple_choice", question: "My sister ______ studying when my mom arrived.",
    options: ["were", "was", "is", "did"], correct: "was" },
  { id: 7, type: "multiple_choice", question: "______ there any milk in the fridge yesterday?",
    options: ["Was", "Were", "Is", "Are"], correct: "Was" },
  { id: 8, type: "multiple_choice", question: "They ______ visit their grandparents next weekend.",
    options: ["are going to", "was going to", "going to", "went to"], correct: "are going to" },
  { id: 9, type: "multiple_choice", question: "Laura didn’t ______ dinner at home last night.",
    options: ["ate", "eats", "eat", "eating"], correct: "eat" },
  { id: 10, type: "multiple_choice", question: "My brother can help ______ with your homework.",
    options: ["you", "yourself", "your", "yours"], correct: "you" },
  { id: 11, type: "multiple_choice", question: "The children ______ happy after the class.",
    options: ["was", "were", "did", "are being"], correct: "were" },
  { id: 12, type: "multiple_choice", question: "We ______ soccer when it started to rain.",
    options: ["played", "play", "were playing", "was playing"], correct: "were playing" },
  { id: 13, type: "multiple_choice", question: "There ______ a big dog in front of the house.",
    options: ["were", "was", "are", "be"], correct: "was" },
  { id: 14, type: "multiple_choice", question: "Maria ______ travel to Canada next year.",
    options: ["is going to", "are going to", "going to", "went to"], correct: "is going to" },
  { id: 15, type: "multiple_choice", question: "Did your teacher ______ the lesson again?",
    options: ["explained", "explains", "explain", "explaining"], correct: "explain" },
  { id: 16, type: "multiple_choice", question: "You should ______ more water.",
    options: ["drinks", "drink", "drinking", "to drink"], correct: "drink" },
  { id: 17, type: "multiple_choice", question: "The cat cleaned ______ after eating.",
    options: ["himself", "herself", "itself", "themselves"], correct: "itself" },
  { id: 18, type: "multiple_choice", question: "Colombia ______ play against Brazil next month.",
    options: ["will", "was", "did", "were"], correct: "will" },
  { id: 19, type: "multiple_choice", question: "My parents didn’t ______ TV yesterday.",
    options: ["watched", "watches", "watch", "watching"], correct: "watch" },
  { id: 20, type: "multiple_choice", question: "Samuel and I ______ at school last Friday.",
    options: ["was", "were", "is", "did"], correct: "were" },
  { id: 21, type: "multiple_choice", question: "______ you studying English at 8 p.m.?",
    options: ["Was", "Were", "Did", "Are"], correct: "Were" },
  { id: 22, type: "multiple_choice", question: "There weren’t ______ chairs in the classroom.",
    options: ["some", "any", "much", "a"], correct: "any" },
  { id: 23, type: "multiple_choice", question: "My sister must ______ her room today.",
    options: ["cleans", "cleaned", "clean", "cleaning"], correct: "clean" },
  { id: 24, type: "multiple_choice", question: "I saw Pedro, but he didn’t see ______.",
    options: ["I", "my", "me", "myself"], correct: "me" },
  { id: 25, type: "multiple_choice", question: "The students ______ a test yesterday.",
    options: ["have", "had", "has", "having"], correct: "had" },
  { id: 26, type: "multiple_choice", question: "______ there a restaurant near the hotel?",
    options: ["Were", "Was", "Did", "Are"], correct: "Was" },
  { id: 27, type: "multiple_choice", question: "Camila is going to ______ English tonight.",
    options: ["studies", "studied", "study", "studying"], correct: "study" },
  { id: 28, type: "multiple_choice", question: "They hurt ______ during the game.",
    options: ["himself", "herself", "ourselves", "themselves"], correct: "themselves" },
  { id: 29, type: "multiple_choice", question: "We ______ buy a new computer next month.",
    options: ["will", "was", "did", "were"], correct: "will" },
  { id: 30, type: "multiple_choice", question: "Did Mariana ______ her homework yesterday?",
    options: ["finished", "finishes", "finish", "finishing"], correct: "finish" },
  // ── Part 2 — Past Simple Verbs (completar: el estudiante escribe) ──
  { id: 31, type: "fill_blank", question: "go → ______", correct: "went" },
  { id: 32, type: "fill_blank", question: "clean → ______", correct: "cleaned" },
  { id: 33, type: "fill_blank", question: "eat → ______", correct: "ate" },
  { id: 34, type: "fill_blank", question: "study → ______", correct: "studied" },
  { id: 35, type: "fill_blank", question: "have → ______", correct: "had" },
  { id: 36, type: "fill_blank", question: "watch → ______", correct: "watched" },
  { id: 37, type: "fill_blank", question: "see → ______", correct: "saw" },
  { id: 38, type: "fill_blank", question: "live → ______", correct: "lived" },
  { id: 39, type: "fill_blank", question: "buy → ______", correct: "bought" },
  { id: 40, type: "fill_blank", question: "visit → ______", correct: "visited" },
  { id: 41, type: "fill_blank", question: "take → ______", correct: "took" },
  { id: 42, type: "fill_blank", question: "call → ______", correct: "called" },
  { id: 43, type: "fill_blank", question: "make → ______", correct: "made" },
  { id: 44, type: "fill_blank", question: "play → ______", correct: "played" },
  { id: 45, type: "fill_blank", question: "come → ______", correct: "came" },
  { id: 46, type: "fill_blank", question: "need → ______", correct: "needed" },
  { id: 47, type: "fill_blank", question: "drink → ______", correct: "drank" },
  { id: 48, type: "fill_blank", question: "work → ______", correct: "worked" },
  { id: 49, type: "fill_blank", question: "write → ______", correct: "wrote" },
  { id: 50, type: "fill_blank", question: "travel → ______", correct: "traveled / travelled" },
  // ── Part 3 — Complete the Sentences (hint = verbo entre paréntesis, va debajo) ──
  { id: 51, type: "fill_blank", question: "My mom ______ very tired yesterday.", hint: "(be)", correct: "was" },
  { id: 52, type: "fill_blank", question: "The kids ______ in the park when it started to rain.", hint: "(play)", correct: "were playing" },
  { id: 53, type: "fill_blank", question: "There ______ many books on the table last night.", hint: "(be)", correct: "were" },
  { id: 54, type: "fill_blank", question: "I ______ my friend after class yesterday.", hint: "(call)", correct: "called" },
  { id: 55, type: "fill_blank", question: "Daniel didn’t ______ to the gym last weekend.", hint: "(go)", correct: "go" },
  { id: 56, type: "fill_blank", question: "Sofia ______ dinner when her dad arrived.", hint: "(cook)", correct: "was cooking" },
  { id: 57, type: "fill_blank", question: "We ______ at home last Sunday.", hint: "(be)", correct: "were" },
  { id: 58, type: "fill_blank", question: "There ______ any students in the room yesterday. (-)", hint: "(be)", correct: "weren’t / were not" },
  { id: 59, type: "fill_blank", question: "My brother ______ his phone yesterday.", hint: "(lose)", correct: "lost" },
  { id: 60, type: "fill_blank", question: "They ______ visit their family tomorrow.", hint: "(be going to)", correct: "are going to / ’re going to" },
  { id: 61, type: "fill_blank", question: "Carlos ______ his keys yesterday.", hint: "(lose)", correct: "lost" },
  { id: 62, type: "fill_blank", question: "I ______ working when you called me.", hint: "(be)", correct: "was" },
  { id: 63, type: "fill_blank", question: "Laura ______ coffee this morning.", hint: "(drink)", correct: "drank" },
  { id: 64, type: "fill_blank", question: "There ______ a problem with my phone last night.", hint: "(be)", correct: "was" },
  { id: 65, type: "fill_blank", question: "My friends ______ a movie next Friday.", hint: "(will / watch)", correct: "will watch / ’ll watch" },
  // ── Part 4 — Object Pronouns (completar) ──
  { id: 66, type: "fill_blank", question: "This exercise is difficult. I don’t understand ______.", correct: "it" },
  { id: 67, type: "fill_blank", question: "Laura is my friend. I always help ______ with English.", correct: "her" },
  { id: 68, type: "fill_blank", question: "Pedro is calling you. Please answer ______.", correct: "him" },
  { id: 69, type: "fill_blank", question: "My parents are at the door. Can you see ______?", correct: "them" },
  { id: 70, type: "fill_blank", question: "We are lost. Can you help ______?", correct: "us" },
  { id: 71, type: "fill_blank", question: "I need your number. Can you send ______ a message?", correct: "me" },
  { id: 72, type: "fill_blank", question: "That dog is very friendly. I like ______.", correct: "it" },
  { id: 73, type: "fill_blank", question: "Daniel doesn’t know the answer. The teacher is helping ______.", correct: "him" },
  { id: 74, type: "fill_blank", question: "These exercises are difficult. I don’t understand ______.", correct: "them" },
  { id: 75, type: "fill_blank", question: "You are speaking too fast. I can’t understand ______.", correct: "you" },
  // ── Part 5 — Modal Verbs (completar) ──
  { id: 76, type: "fill_blank", question: "You ______ study for the exam. The exam is tomorrow, and you need a good grade.", correct: "should" },
  { id: 77, type: "fill_blank", question: "My sister ______ speak English very well.", correct: "can" },
  { id: 78, type: "fill_blank", question: "Students ______ turn off their phones during the exam. It is a school rule.", correct: "must" },
  { id: 79, type: "fill_blank", question: "You ______ drink more water. It is good for your health.", correct: "should" },
  { id: 80, type: "fill_blank", question: "Carlos ______ play the guitar, but he can’t sing.", correct: "can" },
  { id: 81, type: "fill_blank", question: "We ______ be quiet in the library. It is not allowed to make noise there.", correct: "must" },
  { id: 82, type: "fill_blank", question: "You ______ practice every day if you want to improve your English.", correct: "should" },
  { id: 83, type: "fill_blank", question: "I ______ help you after class. I have free time today.", correct: "can" },
  { id: 84, type: "fill_blank", question: "They ______ clean their room today. Their mom said it is necessary.", correct: "must" },
  { id: 85, type: "fill_blank", question: "She ______ visit a doctor because she feels sick.", correct: "should" },
  // ── Part 6 — Reflexive Pronouns (completar) ──
  { id: 86, type: "fill_blank", question: "I prepared the presentation by ______.", correct: "myself" },
  { id: 87, type: "fill_blank", question: "Sofia looked at ______ in the mirror.", correct: "herself" },
  { id: 88, type: "fill_blank", question: "Carlos hurt ______ during the soccer game.", correct: "himself" },
  { id: 89, type: "fill_blank", question: "The children dressed ______ for school.", correct: "themselves" },
  { id: 90, type: "fill_blank", question: "We did the project by ____________.", correct: "ourselves" },
  { id: 91, type: "fill_blank", question: "Did you make this cake by ______?", correct: "yourself" },
  { id: 92, type: "fill_blank", question: "The cat cleaned ______ after eating.", correct: "itself" },
  { id: 93, type: "fill_blank", question: "You and your brother should prepare ______ for the test.", correct: "yourselves" },
  { id: 94, type: "fill_blank", question: "I don’t want to repeat ______ again.", correct: "myself" },
  { id: 95, type: "fill_blank", question: "My parents introduced ______ to the new teacher.", correct: "themselves" },
  // ── Part 7 — Future Form (completar) ──
  { id: 96, type: "fill_blank", question: "Look at those clouds. It ______ rain.", correct: "is going to / ’s going to" },
  { id: 97, type: "fill_blank", question: "I think Colombia ______ win the game.", correct: "will / ’ll" },
  { id: 98, type: "fill_blank", question: "We ______ visit my grandmother this weekend. We already have the tickets.", correct: "are going to / ’re going to" },
  { id: 99, type: "fill_blank", question: "She is tired. She ______ bed early tonight.", correct: "is going to / ’s going to" },
  { id: 100, type: "fill_blank", question: "Maybe I ______ study medicine in the future.", correct: "will / ’ll" },
  { id: 101, type: "fill_blank", question: "They bought food and drinks. They ______ have a party.", correct: "are going to / ’re going to" },
  { id: 102, type: "fill_blank", question: "I’m sure you ______ like this movie.", correct: "will / ’ll" },
  { id: 103, type: "fill_blank", question: "He has a plane ticket. He ______ travel tomorrow.", correct: "is going to / ’s going to" },
  { id: 104, type: "fill_blank", question: "Don’t worry. I ______ help you.", correct: "will / ’ll" },
  { id: 105, type: "fill_blank", question: "My sister is pregnant. She ______ have her baby soon.", correct: "is going to / ’s going to" },
  // ── Part 8 — Translation (escribir la traducción al inglés) ──
  { id: 106, type: "translation", question: "Yo estaba en la casa ayer.", correct: "I was at home yesterday." },
  { id: 107, type: "translation", question: "Mi hermana no fue al colegio el lunes.", correct: "My sister didn’t go to school on Monday." },
  { id: 108, type: "translation", question: "¿Había muchos estudiantes en la clase?", correct: "Were there many students in the class?" },
  { id: 109, type: "translation", question: "Carlos estaba viendo televisión cuando su mamá llegó.", correct: "Carlos was watching TV when his mom arrived." },
  { id: 110, type: "translation", question: "Nosotros vamos a estudiar inglés esta noche.", correct: "We are going to study English tonight." },
  { id: 111, type: "translation", question: "No había agua en la botella.", correct: "There wasn’t any water in the bottle." },
  { id: 112, type: "translation", question: "Laura no compró comida ayer.", correct: "Laura didn’t buy food yesterday." },
  { id: 113, type: "translation", question: "¿Tu hermano puede ayudarme con esta tarea?", correct: "Can your brother help me with this homework?" },
  { id: 114, type: "translation", question: "Ellos deben limpiar su habitación hoy.", correct: "They must clean their room today." },
  { id: 115, type: "translation", question: "Tú deberías practicar inglés todos los días.", correct: "You should practice English every day." },
  { id: 116, type: "translation", question: "María se lastimó mientras estaba cocinando.", correct: "Maria hurt herself while she was cooking." },
  { id: 117, type: "translation", question: "Yo los vi en el supermercado.", correct: "I saw them at the supermarket." },
  { id: 118, type: "translation", question: "Mis amigos viajarán a México el próximo año.", correct: "My friends will travel to Mexico next year." },
  { id: 119, type: "translation", question: "¿Estabas trabajando ayer?", correct: "Were you working yesterday?" },
  { id: 120, type: "translation", question: "Sofía quería aprender a cocinar.", correct: "Sofia wanted to learn to cook." },
];

// MODO PRUEBAS: solo estas preguntas se presentan (deben coincidir con
// ACTIVE_QUESTION_IDS de lib/exam.js). Pon `null` para usar el banco completo.
const ACTIVE_QUESTION_IDS = null;
const EXAM_QUESTIONS = ACTIVE_QUESTION_IDS
  ? ALL_EXAM_QUESTIONS.filter((q) => ACTIVE_QUESTION_IDS.includes(q.id))
  : ALL_EXAM_QUESTIONS;

// Secciones del examen (cada pregunta pertenece a una "Part" por rango de id).
const EXAM_PARTS = [
  {
    from: 1, to: 30,
    title: "Part 1 – Multiple Choice",
    instr: "Choose the correct option to complete each sentence.",
  },
  {
    from: 31, to: 50,
    title: "Part 2 – Past Simple Verbs",
    instr: "Write the past simple form of each verb.",
  },
  {
    from: 51, to: 65,
    title: "Part 3 – Complete the Sentences",
    instr: "Complete each sentence with the correct form of the verb in parentheses.",
  },
  {
    from: 66, to: 75,
    title: "Part 4 – Object Pronouns",
    instr: "Complete the sentences with the correct object pronoun: me, you, him, her, it, us, them.",
  },
  {
    from: 76, to: 85,
    title: "Part 5 – Modal Verbs",
    instr: "Complete each sentence with can, should, or must.",
  },
  {
    from: 86, to: 95,
    title: "Part 6 – Reflexive Pronouns",
    instr: "Complete the sentences with the correct reflexive pronoun: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves.",
  },
  {
    from: 96, to: 105,
    title: "Part 7 – Choose the Correct Future Form",
    instr: "Complete the sentences with will or be going to.",
  },
  {
    from: 106, to: 120,
    title: "Part 8 – Translation",
    instr: "Translate the sentences into English.",
  },
];
const partOf = (id) => EXAM_PARTS.find((p) => id >= p.from && id <= p.to) || null;

// Aciertos por categoría para la pantalla de resultado:
//  - Grammar = preguntas de opción múltiple (total = 30).
//  - Writing = todo lo que el alumno escribe: completar + traducción (total = 90).
// Devuelve aciertos y total de cada categoría → se muestra como "X/total".
// details: [{ id, score }].
function scoreByCategory(details) {
  const typeById = {};
  let gTot = 0, wTot = 0;
  for (const q of EXAM_QUESTIONS) {
    typeById[q.id] = q.type;
    if (q.type === "multiple_choice") gTot++;
    else if (q.type === "fill_blank" || q.type === "translation") wTot++;
  }
  let gOk = 0, wOk = 0;
  for (const d of details || []) {
    const t = typeById[Number(d.id)];
    if (Number(d.score) <= 0) continue;
    if (t === "multiple_choice") gOk++;
    else if (t === "fill_blank" || t === "translation") wOk++;
  }
  return { grammarOk: gOk, grammarTot: gTot, writingOk: wOk, writingTot: wTot };
}

// El envío ahora va a nuestro propio endpoint /api/submit (mismo dominio),
// que califica en el servidor, guarda en Postgres y pide el feedback a n8n.

// ─── Helpers ──────────────────────────────────────────────────────────────────
const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
// Fecha corta de un intento, ej. "12 sept, 3:45 p. m.".
const fmtFechaIntento = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
};

// Clave de localStorage para guardar el progreso (borrador) por estudiante.
// Lleva la versión del examen (a2) para no restaurar borradores del examen anterior.
const draftKey = (email) => `speakeasy_eval_a2_${String(email).trim().toLowerCase()}`;

// Fondo morado con glows radiales (pantalla intro y, a futuro, otras).
const INTRO_BG =
  "radial-gradient(circle at 12% 10%, rgba(138,56,245,0.5) 0%, rgba(138,56,245,0) 42%)," +
  "radial-gradient(circle at 88% 90%, rgba(138,56,245,0.55) 0%, rgba(138,56,245,0) 45%)," +
  "#361E55";

// Duración del examen (cronómetro): 2 horas.
const EXAM_DURATION_SEC = 2 * 60 * 60;
// Faltando estos segundos o menos, el cronómetro se pone rojo y palpita (≤ 3 min).
const TIMER_WARN_SEC = 3 * 60;

const TOPBAR_GRAD = "linear-gradient(90deg, #41276B 0%, #613BA0 55%, #E9407E 100%)";


// Separa una pregunta de "completar" en instrucción + oración con el espacio.
// Ej: "Completa...: 'By the time she arrived, we ___ waiting.'" ->
//   { instruction: "Completa...", sentence: "By the time she arrived, we ___ waiting." }
function splitFill(text) {
  const m = String(text || "").match(/^(.*?):\s*['"](.+)['"]\s*$/s);
  if (m) return { instruction: m[1].trim(), sentence: m[2].trim() };
  return { instruction: String(text || ""), sentence: "" };
}

// Estilos del examen (tema claro, una pregunta por página).
const xs = {
  page: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    background: "#ffffff url('/FONDO.png') center center / cover no-repeat fixed",
    color: "#2b2240",
  },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 28px", background: TOPBAR_GRAD,
  },
  topLogo: { height: 42 },
  topRight: { display: "flex", alignItems: "center", gap: 14 },
  logout: {
    borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 500,
    fontSize: 14, padding: "9px 18px", cursor: "pointer",
  },
  verCalif: {
    borderRadius: 10, border: "none", background: "#fff", color: "#E9407E",
    fontWeight: 700, fontSize: 14, padding: "9px 18px", cursor: "pointer",
  },
  avatar: {
    width: 38, height: 38, borderRadius: "50%", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  body: {
    flex: 1, display: "flex", gap: 28, width: "100%", maxWidth: 1180,
    margin: "0 auto", padding: "34px 28px 48px", alignItems: "flex-start",
  },
  main: { flex: 1, minWidth: 0 },
  subHeader: { fontSize: 17, fontWeight: 700, color: "#2b2240", margin: "4px 0 12px" },
  progressRow: { display: "flex", alignItems: "center", gap: 16, marginBottom: 30 },
  progressTrack: {
    flex: 1, height: 8, borderRadius: 999, background: "rgba(120,90,180,0.15)", overflow: "hidden",
  },
  progressFill: {
    height: "100%", borderRadius: 999,
    background: "linear-gradient(90deg, #6D2EBF 0%, #FF327D 100%)", transition: "width 0.3s",
  },
  counter: { fontSize: 15, fontWeight: 600, color: "#9a93ad", flexShrink: 0 },
  ejTitle: { fontSize: 26, fontWeight: 800, color: "#3a1d6e", marginBottom: 10 },
  ejQuestion: { fontSize: 16, color: "#2b2240", marginBottom: 26, lineHeight: 1.5 },
  instr: { fontSize: 15, fontWeight: 700, color: "#2b2240", marginBottom: 16 },
  optionList: { display: "flex", flexDirection: "column", gap: 14 },
  option: {
    display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
    border: "none", borderRadius: 12, background: "#efeff1",
    padding: "12px 14px", cursor: "pointer", transition: "all 0.15s", outline: "none",
  },
  optionSelected: {
    background: "linear-gradient(100deg, #34206b 0%, #7838d4 100%)",
  },
  optionLetter: {
    width: 34, height: 34, flexShrink: 0, borderRadius: 9,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#9a93ad", background: "#ffffff",
  },
  optionText: { fontSize: 15, color: "#2b2240" },
  fillBox: {
    border: "1.5px solid #d9d2ea", borderRadius: 14, padding: "26px 24px",
    fontSize: 17, color: "#2b2240", lineHeight: 1.8, background: "#fff",
  },
  fillInput: {
    border: "none", borderBottom: "2px solid #2b2240", minWidth: 110,
    fontSize: 17, textAlign: "center", padding: "2px 8px", margin: "0 6px",
    fontFamily: "inherit", color: "#2b2240", fontWeight: 600, background: "transparent",
  },
  transBox: {
    border: "1.5px solid #d9d2ea", borderRadius: 14, padding: "20px 22px", background: "#fff",
  },
  transSentence: { fontSize: 16, color: "#2b2240", fontWeight: 600, marginBottom: 14 },
  transInput: {
    width: "100%", border: "1.5px solid #d9d2ea", borderRadius: 10, padding: "12px 14px",
    fontSize: 15, fontFamily: "inherit", color: "#2b2240", resize: "vertical", outline: "none",
    background: "#faf9fc",
  },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: 36 },
  btnPrev: {
    borderRadius: 10, border: "1.5px solid #FF327D", background: "#fff",
    color: "#FF327D", fontWeight: 600, fontSize: 14, padding: "11px 22px", cursor: "pointer",
  },
  btnNext: {
    borderRadius: 10, border: "none", background: "#FF327D", color: "#fff",
    fontWeight: 600, fontSize: 14, padding: "11px 26px", cursor: "pointer",
  },
  sidebar: { width: 270, flexShrink: 0, display: "flex", flexDirection: "column", gap: 18 },
  timerCard: { background: "#f1ecfb", borderRadius: 16, padding: "16px 20px", textAlign: "center" },
  timerLabel: { fontSize: 13, color: "#9a93ad", marginBottom: 4 },
  timerValue: { fontSize: 28, fontWeight: 800, color: "#2b2240", letterSpacing: 1 },
  stepperCard: {
    background: "#f1ecfb", borderRadius: 16, padding: "18px 22px",
    maxHeight: 380, overflowY: "auto",
  },
  errorBox: {
    marginTop: 22, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#c0294b", borderRadius: 10, padding: "10px 14px", fontSize: 14,
  },
  // Examen en celular: pregunta dentro de tarjeta morada con el cronómetro encima.
  mCard: {
    position: "relative", marginTop: 46, marginBottom: 26,
    background: "linear-gradient(160deg, #4a2c7d 0%, #38205f 100%)",
    borderRadius: 20, padding: "56px 22px 28px", textAlign: "center", color: "#fff",
  },
  mTimer: {
    position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
    width: 80, height: 80, borderRadius: "50%", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
  },
  mTimerText: { position: "absolute", fontSize: 12, fontWeight: 800, color: "#2b2240" },
  mEjTitle: { fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 },
  mEjQuestion: { fontSize: 15, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 },
  // Pantalla de confirmación antes de enviar.
  confirmOverlay: {
    position: "fixed", inset: 0, zIndex: 200, padding: 24, background: INTRO_BG,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  confirmClose: {
    position: "absolute", top: 24, right: 32, background: "none", border: "none",
    color: "rgba(255,255,255,0.85)", fontSize: 16, cursor: "pointer",
  },
  confirmTitle: {
    fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 800, color: "#fff",
    textAlign: "center", lineHeight: 1.2, maxWidth: 560, marginBottom: 28,
  },
  confirmSub: { fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 18 },
  confirmBtn: {
    borderRadius: 12, border: "none", padding: "14px 0", width: "min(420px, 80vw)",
    background: "linear-gradient(90deg, #FF327D 0%, #6D2EBF 100%)", color: "#fff",
    fontWeight: 600, fontSize: 15, cursor: "pointer",
  },
  // Pantalla de carga mientras la IA califica.
  loadOverlay: {
    position: "fixed", inset: 0, zIndex: 300, background: INTRO_BG, padding: 24,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 36, flexWrap: "wrap",
  },
  loadCard: {
    background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.14)", borderRadius: 24, padding: "34px 40px",
    width: 300, display: "flex", flexDirection: "column", alignItems: "center",
  },
  loadTop: { color: "rgba(255,255,255,0.85)", fontSize: 15, marginBottom: 22 },
  loadRingWrap: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 },
  loadPct: { position: "absolute", fontSize: 30, fontWeight: 800, color: "#fff" },
  loadText: { color: "rgba(255,255,255,0.85)", fontSize: 15, textAlign: "center", lineHeight: 1.4 },
  loadVideo: { width: "min(440px, 82vw)", height: "auto", borderRadius: 16 },
  // Pantalla de celebración (antes del feedback).
  celebOverlay: {
    position: "fixed", inset: 0, zIndex: 250, background: INTRO_BG,
    overflowX: "hidden", overflowY: "auto",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: 24, textAlign: "center",
  },
  celebInner: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" },
  celebTrophy: { width: 150, height: "auto", marginBottom: 16, filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.3))" },
  celebTitle: { fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 800, color: "#fff", marginBottom: 10 },
  celebSub: { fontSize: 15, color: "rgba(255,255,255,0.82)", maxWidth: 430, lineHeight: 1.45, marginBottom: 28 },
  celebCard: {
    background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20,
    padding: "26px 30px", display: "flex", alignItems: "center", gap: 30, marginBottom: 28,
    flexWrap: "wrap", justifyContent: "center",
  },
  celebRingWrap: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  celebScoreCtr: { position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" },
  celebScoreVal: { fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1 },
  celebScoreLabel: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  celebRows: { display: "flex", flexDirection: "column", gap: 10 },
  celebRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
    background: "#fff", borderRadius: 10, padding: "11px 16px", minWidth: 210,
  },
  celebRowLabel: { fontSize: 14, color: "#2b2240" },
  // Número logrado: negro, mismo tamaño que el total.
  celebRowVal: { fontSize: 17, fontWeight: 600, color: "#2b2240" },
  // El "/total": fucsia, para que resalte (un poco más pequeño).
  celebRowTot: { fontSize: 17, fontWeight: 800, color: "#E9407E", marginLeft: 1 },
  celebBtn: {
    position: "relative", zIndex: 1, borderRadius: 12, border: "none", padding: "14px 0",
    width: "min(420px, 82vw)", background: "linear-gradient(90deg, #FF327D 0%, #6D2EBF 100%)",
    color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer",
  },
  // Contenido de la celebración: margin auto centra verticalmente, pero si no
  // cabe (varios intentos / celular) deja hacer scroll desde arriba.
  celebContent: {
    position: "relative", zIndex: 1, margin: "auto 0",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  // Selector de intentos (debajo de "Revisa tu Feedback").
  attemptsWrap: { display: "flex", flexDirection: "column", gap: 10, width: "min(420px, 82vw)", marginTop: 26 },
  attemptsLabel: {
    fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)", textAlign: "left", margin: "0 0 2px 4px",
  },
  attemptBtn: {
    display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 14, padding: "10px 14px", color: "#fff", cursor: "pointer", fontFamily: "inherit",
    transition: "background 0.15s, border-color 0.15s, transform 0.15s",
  },
  attemptBtnActive: {
    background: "rgba(255,50,125,0.16)", border: "1px solid #FF327D", cursor: "default",
  },
  attemptNum: {
    width: 36, height: 36, flexShrink: 0, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, fontWeight: 800, background: "rgba(255,255,255,0.14)", color: "#fff",
  },
  attemptNumActive: { background: "linear-gradient(135deg, #FF327D 0%, #6D2EBF 100%)" },
  attemptInfo: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 },
  attemptTitle: { fontSize: 15, fontWeight: 600, color: "#fff" },
  attemptDate: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  attemptScore: { fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0 },
  attemptScoreTot: { fontSize: 13, fontWeight: 700, color: "#FF7AAE", marginLeft: 1 },
  attemptSide: {
    flexShrink: 0, minWidth: 58, textAlign: "center", fontSize: 12, fontWeight: 600,
    color: "rgba(255,255,255,0.75)",
  },
  attemptTag: {
    display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 10px",
    borderRadius: 999, background: "#FF327D", color: "#fff",
  },
  attemptError: { fontSize: 13, color: "#ffb4c8", textAlign: "center", margin: "2px 0 0" },
  // Pantalla de feedback final.
  fbOverlay: {
    position: "fixed", inset: 0, zIndex: 250, background: INTRO_BG,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 22, padding: 24,
  },
  fbCard: {
    background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 22, padding: 18, width: "min(560px, 92vw)",
  },
  fbScroll: {
    maxHeight: "min(56vh, 460px)", overflowY: "auto", padding: "16px 20px",
    borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)",
  },
  fbText: {
    color: "rgba(255,255,255,0.92)", fontSize: 15, lineHeight: 1.7,
    whiteSpace: "pre-wrap", textAlign: "justify",
  },
  fbBtn: {
    borderRadius: 12, border: "none", padding: "14px 0", width: "min(560px, 92vw)",
    background: "linear-gradient(90deg, #FF327D 0%, #6D2EBF 100%)", color: "#fff",
    fontWeight: 600, fontSize: 15, cursor: "pointer",
  },
  fbReviewBtn: {
    borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.12)",
    color: "#fff", fontWeight: 600, fontSize: 15, padding: "13px 0", width: "min(560px, 92vw)", cursor: "pointer",
  },
  // Pantalla de revisión (tu respuesta vs correcta).
  revOverlay: {
    position: "fixed", inset: 0, zIndex: 250, overflowY: "auto", padding: "46px 20px 56px",
    background: "#ffffff url('/FONDO.png') center center / cover no-repeat fixed", color: "#2b2240",
  },
  revCloseTop: {
    position: "fixed", top: 16, right: 20, zIndex: 251, background: "rgba(43,34,64,0.10)",
    border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 14, color: "#2b2240",
    cursor: "pointer", fontWeight: 600,
  },
  revContainer: { maxWidth: 760, margin: "0 auto" },
  revTitle: { fontSize: 26, fontWeight: 800, color: "#3a1d6e", textAlign: "center", marginBottom: 6 },
  revScore: { fontSize: 16, color: "#6b6480", textAlign: "center", marginBottom: 22 },
  revPartTitle: { fontSize: 22, fontWeight: 800, color: "#3a1d6e", margin: "26px 0 14px" },
  revSubHeader: { fontSize: 16, fontWeight: 700, color: "#2b2240", margin: "10px 0 8px" },
  revQBlock: { marginBottom: 22 },
  revQText: { fontSize: 15, color: "#2b2240", marginBottom: 10, lineHeight: 1.4 },
  revOptList: { display: "flex", flexDirection: "column", gap: 10 },
  revFillAns: {
    display: "inline-block", borderBottom: "2px solid", padding: "0 8px", margin: "0 4px",
    fontWeight: 700, minWidth: 60, textAlign: "center",
  },
  revAnsBox: {
    marginTop: 12, padding: "11px 14px", borderRadius: 10, background: "#faf9fc",
    border: "1px solid #e3ddf0", fontWeight: 600, fontSize: 15,
  },
  revCorrectLine: { fontSize: 14, color: "#6b6480", marginTop: 8 },
  revFeedback: { marginTop: 26, background: "#f1ecfb", borderRadius: 16, padding: "20px 22px" },
  revFeedbackLabel: { fontSize: 13, fontWeight: 700, color: "#6D2EBF", letterSpacing: 0.5, marginBottom: 8 },
  revFeedbackText: { fontSize: 15, color: "#2b2240", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  revBtn: {
    display: "block", width: "100%", marginTop: 24, borderRadius: 12, border: "none", padding: "14px 0",
    background: "linear-gradient(90deg, #FF327D 0%, #6D2EBF 100%)", color: "#fff", fontWeight: 600,
    fontSize: 15, cursor: "pointer",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
// Lluvia de confeti (CSS): piezas que caen con color/rotación/tiempo aleatorios.
function Confetti({ count = 70 }) {
  const pieces = useMemo(() => {
    const colors = ["#FF327D", "#6D2EBF", "#22c55e", "#facc15", "#38bdf8", "#fb923c", "#f472b6"];
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      bg: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3.5,
      dur: 2.6 + Math.random() * 2.6,
      size: 6 + Math.random() * 7,
      rot: Math.random() * 360,
    }));
  }, [count]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute", top: "-12vh", left: `${p.left}%`,
            width: p.size, height: p.size * 0.55, background: p.bg, borderRadius: 2,
            transform: `rotate(${p.rot}deg)`,
            animation: `confettiFall ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ProgressRing({ progress, size = 96, stroke = 7, color = "white", track = "rgba(255,255,255,0.15)" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={track} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

function MultipleChoiceQuestion({ question, value, onChange, index }) {
  return (
    <div style={styles.questionCard}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>{index + 1}</span>
        <span style={styles.questionBadge}>Opción Múltiple</span>
      </div>
      <p style={styles.questionText}>{question.question}</p>
      <div style={styles.optionsGrid}>
        {question.options.map((opt, i) => {
          const selected = value === opt;
          return (
            <button key={i} onClick={() => onChange(opt)}
              style={{ ...styles.optionBtn, ...(selected ? styles.optionBtnSelected : {}) }}>
              <span style={{ ...styles.optionLetter, ...(selected ? styles.optionLetterSelected : {}) }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span style={styles.optionText}>{opt}</span>
              {selected && <span style={styles.checkIcon}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillBlankQuestion({ question, value, onChange, index }) {
  const parts = question.question.split(/_{3,}/);
  const before = parts[0] ?? "";
  const after = parts.slice(1).join(" ");
  return (
    <div style={styles.questionCard}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>{index + 1}</span>
        <span style={{ ...styles.questionBadge, background: "rgba(184,107,196,0.18)", color: "#d8b4fe" }}>
          Completar
        </span>
      </div>
      <p style={styles.fillSentenceBox}>
        {before}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="..."
          style={styles.fillInput}
        />
        {after}
      </p>
    </div>
  );
}

function OpenQuestion({ question, value, onChange, index }) {
  const words = countWords(value);
  const minWords = question.minWords || 10;
  const pct = Math.min((words / minWords) * 100, 100);
  const ok = words >= minWords;
  return (
    <div style={styles.questionCard}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>{index + 1}</span>
        <span style={{ ...styles.questionBadge, background: "rgba(255,50,125,0.18)", color: "#ff8ab9" }}>
          Respuesta Abierta
        </span>
      </div>
      <p style={styles.questionText}>{question.question}</p>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        style={styles.textarea}
        rows={6}
      />
      <div style={styles.wordCountRow}>
        <div style={styles.wordBar}>
          <div style={{ ...styles.wordBarFill, width: `${pct}%`, background: ok ? "#ff327d" : "#b86bc4" }} />
        </div>
          <span style={{ ...styles.wordCount, color: ok ? "#ff327d" : "rgba(255,255,255,0.45)" }}>
          {words} / {minWords} palabras {ok ? "✓" : ""}
        </span>
      </div>
    </div>
  );
}

function ResultCard({ result, onClose, onReview, onRetry }) {
  const feedback =
    result?.feedback ?? result?.general_feedback ?? result?.message ?? "Evaluación completada.";

  return (
    <div style={xs.fbOverlay}>
      <div style={xs.fbCard}>
        <div style={xs.fbScroll} className="fb-scroll">
          <p style={xs.fbText}>{feedback}</p>
        </div>
      </div>
      {onReview && (
        <button onClick={onReview} style={xs.fbReviewBtn}>Ver mis respuestas</button>
      )}
      {onRetry && (
        <button onClick={onRetry} style={xs.fbReviewBtn}>Repetir evaluación</button>
      )}
      <button onClick={onClose} style={xs.fbBtn}>Cerrar</button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EnglishExam() {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [validating, setValidating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null); // null | "evaluacion"
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [corrections, setCorrections] = useState(null);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [error, setError] = useState(null);
  // Navegación por pregunta + cronómetro.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // layout de celular
  const [showConfirm, setShowConfirm] = useState(false); // confirmación antes de enviar
  const [showCelebration, setShowCelebration] = useState(false); // felicitaciones antes del feedback
  // Intentos previos: [{ id, numero, total_score, created_at }] (del más antiguo al más reciente).
  const [attempts, setAttempts] = useState([]);
  const [activeAttemptId, setActiveAttemptId] = useState(null);   // intento que se está mostrando
  const [loadingAttemptId, setLoadingAttemptId] = useState(null); // intento que se está cargando
  const [attemptError, setAttemptError] = useState(null);
  const [examStart, setExamStart] = useState(null); // timestamp ms de inicio
  const [nowTick, setNowTick] = useState(0);         // re-render cada segundo
  const timerRef = useRef(null);
  const tabSwitchesRef = useRef(0);
  const draftLoadedRef = useRef(false);
  const [securityWarn, setSecurityWarn] = useState(null);

  // ── Seguridad anti-trampa: activa solo mientras se responde el examen ──
  const examActive = nameSubmitted && selectedModule === "evaluacion" && !result;
  useEffect(() => {
    if (!examActive) return;
    let warnTimer;
    const aviso = (msg) => {
      setSecurityWarn(msg);
      clearTimeout(warnTimer);
      warnTimer = setTimeout(() => setSecurityWarn(null), 2800);
    };
    const blockClip = (e) => {
      e.preventDefault();
      aviso("Copiar y pegar está deshabilitado durante la evaluación.");
    };
    const blockDefault = (e) => e.preventDefault();
    const blockSelect = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return; // permite editar respuestas
      e.preventDefault();
    };
    const onKey = (e) => {
      const k = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a", "p", "u", "s"].includes(k)) {
        e.preventDefault();
        aviso("Esa acción está deshabilitada durante la evaluación.");
        return;
      }
      if (e.key === "F12") return e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) e.preventDefault();
    };
    const onVisibility = () => {
      if (document.hidden) {
        tabSwitchesRef.current += 1;
        aviso("Saliste de la evaluación. Esto queda registrado.");
      }
    };
    document.addEventListener("copy", blockClip);
    document.addEventListener("cut", blockClip);
    document.addEventListener("paste", blockClip);
    document.addEventListener("contextmenu", blockDefault);
    document.addEventListener("dragstart", blockDefault);
    document.addEventListener("selectstart", blockSelect);
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(warnTimer);
      document.removeEventListener("copy", blockClip);
      document.removeEventListener("cut", blockClip);
      document.removeEventListener("paste", blockClip);
      document.removeEventListener("contextmenu", blockDefault);
      document.removeEventListener("dragstart", blockDefault);
      document.removeEventListener("selectstart", blockSelect);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [examActive]);

  // Al cargar: si ya hay sesión activa,
  // saltar el login y mostrar el menú directamente.
  useEffect(() => {
    let cancelado = false;
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelado && d?.authenticated) {
          setStudentName(d.nombre || "");
          setStudentEmail(d.email || "");
          setNameSubmitted(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  // ── Guardado automático del progreso (anti-pérdida por apagón / cierre) ──
  // Al entrar al examen, restaura el borrador guardado para este correo.
  useEffect(() => {
    if (selectedModule !== "evaluacion" || result || !studentEmail || draftLoadedRef.current) {
      return;
    }
    let start = Date.now();
    try {
      const raw = localStorage.getItem(draftKey(studentEmail));
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.answers) setAnswers(saved.answers);
        if (typeof saved?.currentIndex === "number") setCurrentIndex(saved.currentIndex);
        if (typeof saved?.examStart === "number") start = saved.examStart; // conserva el cronómetro
      }
    } catch {}
    setExamStart(start); // si no había borrador, arranca el cronómetro ahora
    draftLoadedRef.current = true;
  }, [selectedModule, result, studentEmail]);

  // Guarda el progreso (respuestas, pregunta actual y arranque del cronómetro).
  useEffect(() => {
    if (selectedModule !== "evaluacion" || result || !studentEmail || !draftLoadedRef.current) {
      return;
    }
    try {
      localStorage.setItem(
        draftKey(studentEmail),
        JSON.stringify({ answers, currentIndex, examStart, ts: Date.now() })
      );
    } catch {}
  }, [answers, currentIndex, examStart, selectedModule, result, studentEmail]);

  // Cronómetro: tic cada segundo. Es solo informativo: al llegar a 0 se queda
  // en 00:00:00 y el estudiante puede seguir presentando el test.
  useEffect(() => {
    if (!examActive || !examStart) return;
    const tick = () => setNowTick(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [examActive, examStart]);

  // Detecta celular (≤767px) para cambiar el layout del examen.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Nº de espacios (blanks) de una pregunta de completar.
  const numBlanks = (q) => String(q.question).split(/_{3,}/).length - 1;
  // ¿La pregunta está respondida? (texto en MC; todos los espacios en completar)
  const isAnswered = (q) => {
    const a = answers[q.id];
    if (q.type === "fill_blank") {
      const nb = numBlanks(q);
      return (
        nb > 0 &&
        Array.isArray(a) &&
        a.filter((v) => v != null && String(v).trim() !== "").length >= nb
      );
    }
    return a != null && String(a).trim() !== "";
  };
  const totalAnswered = EXAM_QUESTIONS.filter(isAnswered).length;

  const handleAnswer = (id, val) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));
  // Para completar: setea el valor del espacio `bi` (guarda un array por pregunta).
  const setFillValue = (id, bi, val) =>
    setAnswers((prev) => {
      const arr = Array.isArray(prev[id]) ? [...prev[id]] : [];
      arr[bi] = val;
      return { ...prev, [id]: arr };
    });
  const getFillValue = (id, bi) =>
    (Array.isArray(answers[id]) ? answers[id][bi] : "") || "";

  // Navegación entre ejercicios.
  const total = EXAM_QUESTIONS.length;
  const goPrev = () => {
    setError(null);
    setCurrentIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    setError(null);
    if (currentIndex >= total - 1) setShowConfirm(true); // muestra confirmación
    else setCurrentIndex((i) => Math.min(total - 1, i + 1));
  };

  // Pide el feedback a la IA en bucle hasta que esté listo. Mientras la IA esté
  // ocupada, /api/feedback responde { ready:false } y seguimos esperando (la
  // pantalla sigue cargando). NUNCA mostramos feedback genérico por una demora.
  const esperarFeedback = async (email) => {
    let noEncontrado = 0;
    for (;;) {
      try {
        const r = await axios.post("/api/feedback", { email }, { timeout: 170000 });
        const d = Array.isArray(r.data) ? r.data[0] : r.data;
        if (d?.ready && d?.feedback) return d;
        // 404/notFound: la evaluación aún no aparece (o no se guardó). Tolera
        // unos intentos por si fue un fallo real de guardado.
        if (d?.notFound) {
          if (++noEncontrado >= 6) throw new Error("evaluacion_no_encontrada");
        } else {
          noEncontrado = 0;
        }
      } catch (e) {
        if (e?.message === "evaluacion_no_encontrada") throw e;
        if (e?.response?.status === 404 && ++noEncontrado >= 6) {
          throw new Error("evaluacion_no_encontrada");
        }
        // timeout / 5xx / red: la IA puede seguir procesando; reintentamos.
      }
      await new Promise((res) => setTimeout(res, 4000));
    }
  };

  // Muestra una evaluación guardada (respuesta de /api/mi-evaluacion) y
  // actualiza la lista de intentos.
  const aplicarEvaluacion = (d) => {
    setAnswers(d.answers || {});
    setCorrections(d.detailed_results || null);
    setResult({
      score: d.total_score,
      feedback: d.feedback || "Evaluación completada.",
      details: d.detailed_results,
    });
    setAttempts(d.attempts || []);
    setActiveAttemptId(d.id ?? null);
  };

  // Refresca la lista de intentos (el más reciente queda como el activo).
  const cargarIntentos = async () => {
    try {
      const res = await axios.post("/api/mi-evaluacion", { email: studentEmail.trim() });
      if (res.data?.exists) {
        setAttempts(res.data.attempts || []);
        setActiveAttemptId(res.data.id ?? null);
      }
    } catch {}
  };

  // "Ver intento N": carga ese intento y lo muestra en la misma pantalla.
  const verIntento = async (id) => {
    if (id === activeAttemptId || loadingAttemptId) return;
    setLoadingAttemptId(id);
    setAttemptError(null);
    try {
      const res = await axios.post("/api/mi-evaluacion", { email: studentEmail.trim(), id });
      if (!res.data?.exists) throw new Error("intento_no_encontrado");
      aplicarEvaluacion(res.data);
      setCurrentIndex(0);
    } catch {
      setAttemptError("No pudimos cargar ese intento. Intenta de nuevo.");
    } finally {
      setLoadingAttemptId(null);
    }
  };

  // Cierra la carga y muestra la celebración con el resultado.
  const mostrarResultado = ({ score, feedback, details }) => {
    clearInterval(timerRef.current);
    setSubmitProgress(100);
    cargarIntentos(); // incluye el intento recién enviado
    setTimeout(() => {
      setSubmitting(false);
      setResult({ score, feedback, details });
      setCorrections(details || null);
      setShowCelebration(true);
      try { localStorage.removeItem(draftKey(studentEmail)); } catch {}
    }, 600);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (totalAnswered < EXAM_QUESTIONS.length) {
      const missing = EXAM_QUESTIONS.filter((q) => !isAnswered(q));
      setError(`Por favor completa todas las preguntas: P${missing.map((q) => q.id).join(", ")}`);
      return;
    }
    setError(null);
    setShowConfirm(false);
    setSubmitting(true);
    setSubmitProgress(0);

    // Animated progress while waiting
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 90) p = 90;
      setSubmitProgress(Math.round(p));
    }, 600);

    const payload = {
      student: { name: studentName, email: studentEmail },
      answers,
      tabSwitches: tabSwitchesRef.current,
    };

    try {
      const res = await axios.post("/api/submit", payload, { timeout: 170000 });
      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!data.ai_failed && data.global_report?.resumen_desempeño) {
        // Feedback listo de inmediato (caso normal).
        mostrarResultado({
          score: data.total_score,
          feedback: data.global_report.resumen_desempeño,
          details: data.detailed_results,
        });
      } else {
        // Respuestas guardadas, pero la IA aún no respondió: seguimos cargando
        // y esperamos a que /api/feedback lo genere (sin genérico).
        const fb = await esperarFeedback(studentEmail);
        mostrarResultado({
          score: fb.total_score ?? data.total_score,
          feedback: fb.feedback,
          details: fb.detailed_results ?? data.detailed_results,
        });
      }
    } catch (err) {
      // El envío falló (timeout/saturación), pero las respuestas pudieron
      // guardarse: intentamos esperar el feedback igual antes de rendirnos.
      try {
        const fb = await esperarFeedback(studentEmail);
        mostrarResultado({
          score: fb.total_score,
          feedback: fb.feedback,
          details: fb.detailed_results,
        });
      } catch (e2) {
        clearInterval(timerRef.current);
        setSubmitting(false);
        setSubmitProgress(0);
        setError("No pudimos procesar tu evaluación. Revisa tu conexión e intenta de nuevo.");
      }
    }
  };

  // Repetir la evaluación: limpia el intento anterior y vuelve a la intro.
  // Cada intento se guarda como una evaluación nueva; se muestra la más reciente.
  const repetirEvaluacion = () => {
    try { localStorage.removeItem(draftKey(studentEmail)); } catch {}
    setAnswers({}); setResult(null); setCorrections(null);
    setShowReviewMode(false); setShowCelebration(false); setShowConfirm(false);
    setAlreadySubmitted(false); setError(null);
    setSubmitting(false); setSubmitProgress(0);
    tabSwitchesRef.current = 0; draftLoadedRef.current = false;
    setCurrentIndex(0); setExamStart(null); setNowTick(0);
    setIntroSeen(false);
    setActiveAttemptId(null); setAttemptError(null);
    setSelectedModule("evaluacion");
  };

  const reset = () => {
    setStudentName(""); setStudentEmail(""); setEmailTouched(false); setNameSubmitted(false); setAnswers({});
    setSubmitting(false); setSubmitProgress(0); setResult(null); setError(null);
    setCorrections(null); setShowReviewMode(false);
    setSelectedModule(null); setAuthError(null);
    tabSwitchesRef.current = 0; setSecurityWarn(null);
    setAlreadySubmitted(false); draftLoadedRef.current = false;
    setIntroSeen(false);
    setCurrentIndex(0); setExamStart(null);
    setShowConfirm(false); setShowCelebration(false);
    setAttempts([]); setActiveAttemptId(null); setAttemptError(null);
  };

  // Cierra sesión: limpia la cookie de sesión y vuelve al login.
  const cerrarSesion = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    reset();
  };

  // ── Name Entry Screen ──
  const emailValid = isValidEmail(studentEmail);
  const showEmailError = emailTouched && studentEmail.trim() !== "" && !emailValid;
  const canStart = studentName.trim() !== "" && emailValid;
  const tryStart = async () => {
    if (!emailValid) {
      setEmailTouched(true);
      return;
    }
    if (!canStart || validating) return;

    setValidating(true);
    setAuthError(null);
    try {
      const res = await axios.post("/api/validate-email", {
        email: studentEmail.trim(),
      });
      if (res.data?.authorized) {
        setNameSubmitted(true);
      } else {
        setAuthError(
          "Este correo no está autorizado para la evaluación. Verifica que sea el correo con el que te registraste."
        );
      }
    } catch (err) {
      setAuthError(
        "No pudimos validar tu correo en este momento. Revisa tu conexión e intenta de nuevo."
      );
    } finally {
      setValidating(false);
    }
  };

  // Abre la evaluación: si el estudiante ya la presentó, muestra sus resultados
  // (desde ahí puede repetirla con "Repetir evaluación").
  const goToEvaluacion = async () => {
    setValidating(true);
    setAuthError(null);
    try {
      const res = await axios.post("/api/mi-evaluacion", {
        email: studentEmail.trim(),
      });
      if (res.data?.exists) {
        aplicarEvaluacion(res.data);
        setAttemptError(null);
        setAlreadySubmitted(true);
        setCurrentIndex(0);
        setShowReviewMode(true); // al reingresar: muestra la revisión + feedback
        try { localStorage.removeItem(draftKey(studentEmail)); } catch {}
      }
      setSelectedModule("evaluacion");
    } catch (err) {
      setAuthError(
        "No pudimos verificar tu evaluación en este momento. Intenta de nuevo."
      );
    } finally {
      setValidating(false);
    }
  };

  if (!nameSubmitted) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBg} />
        <Particles />
        <div style={styles.loginCard}>
          <p style={styles.loginWelcome}>¡Bienvenidos!</p>
          <h1 style={styles.loginTitle}>Speak Easy Test</h1>
          <p style={styles.loginSubtitle}>Ingresa tus datos para comenzar</p>

          <label style={styles.loginLabel}>Nombre</label>
          <input
            className="login-input"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryStart()}
            placeholder="Ej. María García López"
            style={styles.loginInput}
          />

          <label style={styles.loginLabel}>Correo electrónico</label>
          <input
            className="login-input"
            value={studentEmail}
            onChange={(e) => {
              setStudentEmail(e.target.value);
              setAuthError(null);
            }}
            onBlur={() => setEmailTouched(true)}
            onKeyDown={(e) => e.key === "Enter" && tryStart()}
            placeholder="Ej. maria.garcia@email.com"
            type="email"
            style={styles.loginInput}
          />

          {showEmailError && (
            <p style={styles.loginError}>
              {studentEmail.includes("@")
                ? "Ingresa un correo electrónico válido (ej. nombre@dominio.com)."
                : "El correo debe contener una arroba (@)."}
            </p>
          )}
          {authError && <p style={styles.loginError}>{authError}</p>}

          <button
            onClick={tryStart}
            disabled={!canStart || validating}
            style={{
              ...styles.loginBtn,
              opacity: canStart && !validating ? 1 : 0.9,
              cursor: canStart && !validating ? "pointer" : "not-allowed",
            }}
          >
            {validating ? "Ingresando…" : "Ingresar"}
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_login.png" alt="Speak Easy" style={styles.loginLogo} />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
          .login-input::placeholder { color: #9a9aa8; }
          .login-input:focus { border-color: #c84df0 !important; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes particleDrift {
            0%{transform:translateY(0) translateX(0);opacity:0}
            10%{opacity:0.95}
            50%{transform:translateY(-50vh) translateX(10px);opacity:0.85}
            90%{opacity:0.5}
            100%{transform:translateY(-100vh) translateX(20px);opacity:0}
          }
        `}</style>
      </div>
    );
  }

  // ── Hub: elegir módulo (después del login) ──
  if (!selectedModule) {
    return (
      <div style={styles.hubPage}>
        <style>{`
          .hub-img-btn { transition: transform 0.2s ease; }
          .hub-img-btn:hover:not(:disabled) { transform: scale(1.04); }
        `}</style>
        <header style={styles.hubTopbar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_blanco.png" alt="Speak Easy" style={styles.hubLogo} />
          <div style={styles.hubTopbarRight}>
            <button onClick={cerrarSesion} style={styles.hubLogout}>
              Cerrar sesión
            </button>
            <span style={styles.hubAvatar}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#9aa3b2" }}>
                {(studentName.trim().charAt(0) || "").toUpperCase()}
              </span>
            </span>
          </div>
        </header>

        <main style={styles.hubMain}>
          <h1 style={styles.hubTitle}>Dale clic al botón y comienza tu test del nivel A2</h1>
          <p style={styles.hubSubtitle}>Lo harás muy bien :)</p>
          {authError && <p style={styles.hubError}>{authError}</p>}

          <button
            onClick={goToEvaluacion}
            disabled={validating}
            className="hub-img-btn"
            style={styles.hubImgBtn}
            aria-label="Realiza tu test de inglés"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Felipe_test.png" alt="Realiza tu test de inglés" style={styles.hubImg} />
          </button>
        </main>
      </div>
    );
  }

  // ── Intro al test (después de elegir "test", antes de empezar) ──
  // Solo si va a presentar el examen: si ya lo presentó (result) se salta y
  // pasa directo a la revisión.
  if (selectedModule === "evaluacion" && !introSeen && !result) {
    return (
      <div style={styles.introPage}>
        <div style={styles.introBg} />
        <button style={styles.introClose} onClick={() => setSelectedModule(null)}>
          Cerrar ✕
        </button>
        <div style={styles.introContent}>
          <div style={styles.introHeader}>
            <h1 style={styles.introTitle}>Estás dando inicio al test</h1>
            <div style={styles.introInfo}>
              <span style={styles.introInfoIcon}>i</span>
              <p style={styles.introInfoText}>
                Antes de comenzar, asegúrate de tener tiempo suficiente. El
                cronómetro es solo una referencia: si llega a cero puedes
                terminar el test. Si quieres, luego podrás repetir la evaluación.
              </p>
            </div>
          </div>
          <p style={styles.introDuration}>
            Este test tiene una duración de 2:00 horas
          </p>
          <button onClick={() => setIntroSeen(true)} style={styles.introBtn}>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // selectedModule === "evaluacion" → continúa al examen
  const examQ = EXAM_QUESTIONS[currentIndex] || EXAM_QUESTIONS[0];
  // La BARRA es GLOBAL (avanza por todo el examen → el estudiante ve que va a terminar).
  const examPct = total ? ((currentIndex + 1) / total) * 100 : 0;
  const elapsedSec = examStart ? Math.floor(((nowTick || Date.now()) - examStart) / 1000) : 0;
  const timeLeftSec = Math.max(0, EXAM_DURATION_SEC - elapsedSec);
  const timerText =
    `${String(Math.floor(timeLeftSec / 3600)).padStart(2, "0")}:` +
    `${String(Math.floor((timeLeftSec % 3600) / 60)).padStart(2, "0")}:` +
    `${String(timeLeftSec % 60).padStart(2, "0")}`;
  const timerPct = (timeLeftSec / EXAM_DURATION_SEC) * 100;
  // Cuando faltan ≤ 3 min: cronómetro rojo con palpito leve.
  const timerCritical = timeLeftSec > 0 && timeLeftSec <= TIMER_WARN_SEC;
  // Tiempo cumplido: se queda en rojo (sin palpitar), pero el test sigue abierto.
  const timeUp = !!examStart && timeLeftSec === 0;
  const TIMER_RED = "#e11d48";

  const part = partOf(examQ.id);
  // Numeración y contador PER-PARTE (reinician en 1 en cada Part).
  const partQs = part
    ? EXAM_QUESTIONS.filter((q) => q.id >= part.from && q.id <= part.to)
    : EXAM_QUESTIONS;
  const idxInPart = partQs.findIndex((q) => q.id === examQ.id);
  const partStartGlobal = currentIndex - idxInPart; // índice global donde arranca la Part
  const partLen = partQs.length;
  const numeroEnParte = idxInPart + 1;

  // Sidebar: ventana per-parte (Ejercicio 1..partLen de la Part actual).
  const WIN = 9;
  const winStart = partLen > WIN ? Math.min(Math.max(0, idxInPart - 4), partLen - WIN) : 0;
  const winQs = partQs.slice(winStart, partLen > WIN ? winStart + WIN : partLen);

  // Completar: la oración con espacio(s) va en la caja; el título es la Part.
  const fillParts =
    examQ.type === "fill_blank" ? String(examQ.question).split(/_{3,}/) : null;
  const numberedQuestion = `${numeroEnParte}. ${examQ.question}`;
  const tituloPrincipal = part ? part.title : `Ejercicio ${numeroEnParte}`;
  // Sub-sección (ej. Part 5 A/B): su propio encabezado e instrucción.
  const section =
    part && part.sections
      ? part.sections.find((s) => examQ.id >= s.from && examQ.id <= s.to)
      : null;
  const subHeader = section ? section.header : null;
  const instrText = section
    ? section.instr
    : part
    ? part.instr
    : "Selecciona la respuesta correcta";
  const currentAnswered = isAnswered(examQ); // no avanza hasta responder
  const reviewMode = showReviewMode && !!result; // revisión: oculta el examen base
  // Puntajes Writing/Grammar (cada uno sobre 100) para la tarjeta de resultado.
  const cats = scoreByCategory(result?.details);

  return (
    <div style={xs.page}>
      <style>{`
        @keyframes timerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .attempt-btn:not(:disabled):hover {
          background: rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.32) !important;
          transform: translateY(-1px);
        }
        .attempt-btn:focus-visible { outline: 2px solid #FF327D; outline-offset: 2px; }
        .attempt-arrow { display: inline-block; font-size: 18px; transition: transform 0.15s; }
        .attempt-btn:not(:disabled):hover .attempt-arrow { transform: translateX(3px); color: #fff; }
      `}</style>
      {securityWarn && (
        <div style={styles.securityOverlay}>
          <div style={styles.securityToast}>{securityWarn}</div>
        </div>
      )}

      {/* Barra superior */}
      <header style={xs.topbar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_blanco.png" alt="Speak Easy" style={xs.topLogo} />
        <div style={xs.topRight}>
          <button onClick={cerrarSesion} style={xs.logout}>Cerrar sesión</button>
          <span style={xs.avatar}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#9aa3b2" }}>
              {(studentName.trim().charAt(0) || "").toUpperCase()}
            </span>
          </span>
        </div>
      </header>

      {!reviewMode && (
      <div
        style={{
          ...xs.body,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 0 : 28,
          padding: isMobile ? "18px 18px 40px" : "34px 28px 48px",
        }}
      >
        {/* Pregunta actual */}
        <main style={xs.main}>
          <div style={xs.progressRow}>
            <div style={xs.progressTrack}>
              <div style={{ ...xs.progressFill, width: `${examPct}%` }} />
            </div>
            <span style={xs.counter}>{numeroEnParte}/{partLen}</span>
          </div>

          {isMobile ? (
            <div style={xs.mCard}>
              <div style={xs.mTimer}>
                <ProgressRing progress={timerPct} size={80} stroke={5} color={timerCritical || timeUp ? TIMER_RED : "#FF327D"} track="#efe7fb" />
                <span
                  style={{
                    ...xs.mTimerText,
                    ...(timerCritical
                      ? { color: TIMER_RED, animation: "timerPulse 1s ease-in-out infinite" }
                      : timeUp
                      ? { color: TIMER_RED }
                      : {}),
                  }}
                >
                  {timerText}
                </span>
              </div>
              <h2 style={xs.mEjTitle}>{tituloPrincipal}</h2>
              {examQ.type === "multiple_choice" && (
                <p style={xs.mEjQuestion}>{instrText}</p>
              )}
            </div>
          ) : (
            <>
              <h1 style={xs.ejTitle}>{tituloPrincipal}</h1>
              {examQ.type === "multiple_choice" && (
                <p style={xs.ejQuestion}>{instrText}</p>
              )}
            </>
          )}

          {subHeader && <p style={xs.subHeader}>{subHeader}</p>}

          {examQ.type === "multiple_choice" ? (
            <>
              <p style={xs.instr}>{numberedQuestion}</p>
              <div style={xs.optionList}>
                {examQ.options.map((opt, i) => {
                  const selected = answers[examQ.id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(examQ.id, opt)}
                      style={{ ...xs.option, ...(selected ? xs.optionSelected : {}) }}
                    >
                      <span
                        style={{
                          ...xs.optionLetter,
                          ...(selected ? { color: "#34206b", background: "#ffffff" } : {}),
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ ...xs.optionText, ...(selected ? { color: "#ffffff", fontWeight: 600 } : {}) }}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : examQ.type === "translation" ? (
            <>
              <p style={xs.instr}>{instrText}</p>
              <div style={xs.transBox}>
                <p style={xs.transSentence}>{numeroEnParte}. {examQ.question}</p>
                <textarea
                  value={answers[examQ.id] || ""}
                  onChange={(e) => handleAnswer(examQ.id, e.target.value)}
                  placeholder="Write the sentence in English…"
                  rows={2}
                  style={xs.transInput}
                />
              </div>
            </>
          ) : (
            <>
              <p style={xs.instr}>{instrText}</p>
              <div style={xs.fillBox}>
                {numeroEnParte}.{" "}
                {fillParts.map((seg, bi) => (
                  <React.Fragment key={bi}>
                    {seg}
                    {bi < fillParts.length - 1 && (
                      <input
                        type="text"
                        value={getFillValue(examQ.id, bi)}
                        onChange={(e) => setFillValue(examQ.id, bi, e.target.value)}
                        style={xs.fillInput}
                      />
                    )}
                  </React.Fragment>
                ))}
                {examQ.hint && (
                  <>
                    <br />
                    <strong>{examQ.hint}</strong>
                  </>
                )}
              </div>
            </>
          )}

          {error && <div style={xs.errorBox}>{error}</div>}

          <div style={xs.navRow}>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              style={{
                ...xs.btnPrev,
                opacity: currentIndex === 0 ? 0.4 : 1,
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={goNext}
              disabled={submitting || !currentAnswered}
              title={currentAnswered ? "" : "Responde la pregunta para continuar"}
              style={{
                ...xs.btnNext,
                opacity: submitting || !currentAnswered ? 0.45 : 1,
                cursor: submitting || !currentAnswered ? "not-allowed" : "pointer",
              }}
            >
              {currentIndex >= total - 1 ? "Finalizar ✓" : "Siguiente →"}
            </button>
          </div>
        </main>

        {/* Sidebar: cronómetro + progreso por pregunta (solo desktop) */}
        {!isMobile && (
        <aside style={xs.sidebar}>
          <div style={xs.timerCard}>
            <p style={xs.timerLabel}>{timeUp ? "Tiempo cumplido" : "Tiempo restante"}</p>
            <p
              style={{
                ...xs.timerValue,
                ...(timerCritical
                  ? { color: TIMER_RED, animation: "timerPulse 1s ease-in-out infinite" }
                  : timeUp
                  ? { color: TIMER_RED }
                  : {}),
              }}
            >
              {timerText}
            </p>
          </div>
          <div style={xs.stepperCard}>
            {winQs.map((q, j) => {
              const posInPart = winStart + j; // posición dentro de la Part (0-based)
              const globalIdx = partStartGlobal + posInPart;
              const done = posInPart <= idxInPart;
              const isCur = posInPart === idxInPart;
              // Solo se puede ir a una pregunta ya alcanzada (atrás/actual) o ya
              // respondida. No se permite saltar a una pregunta futura sin responder.
              const canJump = globalIdx <= currentIndex || isAnswered(q);
              return (
                <div
                  key={q.id}
                  onClick={canJump ? () => { setCurrentIndex(globalIdx); setError(null); } : undefined}
                  style={{ display: "flex", alignItems: "center", gap: 12, height: 34, cursor: canJump ? "pointer" : "not-allowed" }}
                >
                  <div style={{ position: "relative", width: 18, height: 34, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {j > 0 && (
                      <div style={{ position: "absolute", top: 0, height: 17, width: 2, background: posInPart <= idxInPart ? "#FF327D" : "#d8cfe8" }} />
                    )}
                    {j < winQs.length - 1 && (
                      <div style={{ position: "absolute", top: 17, height: 17, width: 2, background: posInPart < idxInPart ? "#FF327D" : "#d8cfe8" }} />
                    )}
                    <div style={{
                      width: isCur ? 15 : 13, height: isCur ? 15 : 13, borderRadius: "50%", zIndex: 1,
                      background: done ? "#FF327D" : "#fff",
                      border: done ? "none" : "2px solid #cfc6e6",
                      boxShadow: isCur ? "0 0 0 4px rgba(255,50,125,0.18)" : "none",
                    }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: isCur ? 700 : 500, color: isCur ? "#2b2240" : (done ? "#6b6480" : "#b3abc6") }}>
                    Ejercicio {posInPart + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
        )}
      </div>
      )}

      {/* Confirmación antes de enviar */}
      {showConfirm && (
        <div style={xs.confirmOverlay}>
          <button onClick={() => setShowConfirm(false)} style={xs.confirmClose}>
            Cerrar ✕
          </button>
          <h2 style={xs.confirmTitle}>Estás finalizando el test</h2>
          <p style={xs.confirmSub}>¿Desea continuar?</p>
          <button
            onClick={() => { setShowConfirm(false); handleSubmit(); }}
            style={xs.confirmBtn}
          >
            Finalizar
          </button>
        </div>
      )}

      {/* Pantalla de carga (IA calificando) */}
      {submitting && (
        <div style={xs.loadOverlay}>
          <div style={xs.loadCard}>
            <p style={xs.loadTop}>Espera un momento...</p>
            <div style={xs.loadRingWrap}>
              <ProgressRing progress={submitProgress} size={130} stroke={9} color="#FF327D" track="rgba(255,255,255,0.18)" />
              <span style={xs.loadPct}>{submitProgress}%</span>
            </div>
            <p style={xs.loadText}>Estamos revisando tus respuestas</p>
          </div>
          {/* En celular no se muestra la animación, solo la tarjeta de carga */}
          {!isMobile && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/Spiky%20Calificando.gif" alt="" style={xs.loadVideo} />
          )}
        </div>
      )}

      {/* Celebración (antes del feedback) */}
      {result && showCelebration && (
        <div style={xs.celebOverlay}>
          <Confetti />
          <div style={xs.celebContent}>
            <div style={xs.celebInner}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={celebracionPorPuntaje(result.score).img} alt="" style={xs.celebTrophy} />
              <h2 style={xs.celebTitle}>{celebracionPorPuntaje(result.score).titulo}</h2>
              <p style={xs.celebSub}>{celebracionPorPuntaje(result.score).sub}</p>
              <div style={xs.celebCard}>
                <div style={xs.celebRingWrap}>
                  <ProgressRing
                    progress={typeof result.score === "number" ? Math.max(0, Math.min(100, result.score)) : 0}
                    size={140} stroke={9} color="#FF327D" track="rgba(255,255,255,0.18)"
                  />
                  <div style={xs.celebScoreCtr}>
                    <span style={xs.celebScoreVal}>{result.score}</span>
                    <span style={xs.celebScoreLabel}>Puntaje</span>
                  </div>
                </div>
                <div style={xs.celebRows}>
                  {[
                    ["Writing score", cats.writingOk, cats.writingTot],
                    ["Grammar score", cats.grammarOk, cats.grammarTot],
                  ].map(([label, num, tot]) => (
                    <div key={label} style={xs.celebRow}>
                      <span style={xs.celebRowLabel}>{label}</span>
                      <span style={xs.celebRowVal}>
                        {num}
                        <span style={xs.celebRowTot}>/{tot}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowReviewMode(false); setShowCelebration(false); }}
              style={xs.celebBtn}
            >
              Revisa tu Feedback
            </button>

            {/* Selector de intentos (solo si hay más de uno) */}
            {attempts.length > 1 && (
              <div style={xs.attemptsWrap}>
                <p style={xs.attemptsLabel}>Tus intentos</p>
                {attempts.map((a) => {
                  const active = a.id === activeAttemptId;
                  const loading = a.id === loadingAttemptId;
                  return (
                    <button
                      key={a.id}
                      onClick={() => verIntento(a.id)}
                      disabled={active}
                      aria-current={active ? "true" : undefined}
                      className="attempt-btn"
                      style={{ ...xs.attemptBtn, ...(active ? xs.attemptBtnActive : {}) }}
                    >
                      <span style={{ ...xs.attemptNum, ...(active ? xs.attemptNumActive : {}) }}>
                        {a.numero}
                      </span>
                      <span style={xs.attemptInfo}>
                        <span style={xs.attemptTitle}>Ver intento {a.numero}</span>
                        <span style={xs.attemptDate}>{fmtFechaIntento(a.created_at)}</span>
                      </span>
                      <span style={xs.attemptScore}>
                        {a.total_score}
                        <span style={xs.attemptScoreTot}>/100</span>
                      </span>
                      <span style={xs.attemptSide}>
                        {active ? (
                          <span style={xs.attemptTag}>Viendo</span>
                        ) : loading ? (
                          "Cargando…"
                        ) : (
                          <span className="attempt-arrow">→</span>
                        )}
                      </span>
                    </button>
                  );
                })}
                {attemptError && <p style={xs.attemptError}>{attemptError}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !showReviewMode && !showCelebration && (
        <ResultCard
          result={result}
          onReview={() => { setCurrentIndex(0); setShowReviewMode(true); }}
          onRetry={repetirEvaluacion}
          onClose={() => {
            setResult(null); setShowReviewMode(false); setShowCelebration(false);
            setSelectedModule(null); // vuelve al menú (conserva la sesión)
          }}
        />
      )}

      {/* Revisión: MISMA pantalla del examen, de solo lectura y marcada */}
      {showReviewMode && result && (() => {
        const cerrarMenu = () => {
          setResult(null); setShowReviewMode(false); setShowCelebration(false);
          setSelectedModule(null);
        };
        const corrMap = {};
        if (Array.isArray(corrections)) for (const c of corrections) corrMap[String(c.id)] = c.score;
        const fmt = (a) => {
          if (a == null) return "";
          if (Array.isArray(a)) return a.filter((v) => v != null && String(v).trim() !== "").join(" / ");
          return String(a);
        };
        const ok = corrMap[String(examQ.id)] === 10;
        const sa = answers[examQ.id];
        const goSig = () => {
          setError(null);
          if (currentIndex >= total - 1) setShowReviewMode(false); // -> feedback
          else setCurrentIndex((i) => Math.min(total - 1, i + 1));
        };
        return (
          <div style={{ ...xs.page, position: "fixed", inset: 0, zIndex: 240, overflowY: "auto" }}>
            <header style={xs.topbar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_blanco.png" alt="Speak Easy" style={xs.topLogo} />
              <div style={xs.topRight}>
                <button onClick={() => setShowCelebration(true)} style={xs.verCalif}>
                  Ver calificación
                </button>
                <button onClick={repetirEvaluacion} style={xs.verCalif}>
                  Repetir evaluación
                </button>
                <button onClick={cerrarMenu} style={xs.logout}>Cerrar</button>
                <span style={xs.avatar}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#9aa3b2" }}>
                    {(studentName.trim().charAt(0) || "").toUpperCase()}
                  </span>
                </span>
              </div>
            </header>

            <div
              style={{
                ...xs.body,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 0 : 28,
                padding: isMobile ? "18px 18px 40px" : "34px 28px 48px",
              }}
            >
              <main style={xs.main}>
                <div style={xs.progressRow}>
                  <div style={xs.progressTrack}>
                    <div style={{ ...xs.progressFill, width: `${examPct}%` }} />
                  </div>
                  <span style={xs.counter}>{numeroEnParte}/{partLen}</span>
                </div>

                {isMobile ? (
                  <div style={{ ...xs.mCard, paddingTop: 26 }}>
                    <h2 style={xs.mEjTitle}>{tituloPrincipal}</h2>
                    {examQ.type === "multiple_choice" && <p style={xs.mEjQuestion}>{instrText}</p>}
                  </div>
                ) : (
                  <>
                    <h1 style={xs.ejTitle}>{tituloPrincipal}</h1>
                    {examQ.type === "multiple_choice" && <p style={xs.ejQuestion}>{instrText}</p>}
                  </>
                )}

                {subHeader && <p style={xs.subHeader}>{subHeader}</p>}
                <p style={xs.instr}>{examQ.type === "multiple_choice" ? numberedQuestion : instrText}</p>

                {examQ.type === "multiple_choice" ? (
                  <div style={xs.optionList}>
                    {examQ.options.map((opt, oi) => {
                      const isCorrectOpt = opt === examQ.correct;
                      const isStudentOpt = sa === opt;
                      const mark = isCorrectOpt
                        ? { background: "rgba(34,197,94,0.12)", boxShadow: "inset 0 0 0 1.5px #22c55e" }
                        : isStudentOpt
                        ? { background: "rgba(239,68,68,0.10)", boxShadow: "inset 0 0 0 1.5px #ef4444" }
                        : {};
                      const col = isCorrectOpt ? "#16a34a" : isStudentOpt ? "#dc2626" : null;
                      return (
                        <div key={oi} style={{ ...xs.option, cursor: "default", transition: "none", outline: "none", ...mark }}>
                          <span style={{ ...xs.optionLetter, ...(col ? { color: col } : {}) }}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span style={{ ...xs.optionText, ...(col ? { color: col, fontWeight: 600 } : {}) }}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : examQ.type === "translation" ? (
                  <>
                    <div style={xs.transBox}>
                      <p style={xs.transSentence}>{numeroEnParte}. {examQ.question}</p>
                      <p style={{ ...xs.revAnsBox, color: ok ? "#16a34a" : "#dc2626" }}>
                        {fmt(sa) || "(vacío)"}
                      </p>
                    </div>
                    {!ok && (
                      <p style={xs.revCorrectLine}>
                        Correcta: <span style={{ color: "#16a34a", fontWeight: 700 }}>{examQ.correct}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div style={xs.fillBox}>
                      {numeroEnParte}.{" "}
                      {(fillParts || []).map((seg, bi, arr) => (
                        <React.Fragment key={bi}>
                          {seg}
                          {bi < arr.length - 1 && (
                            <span
                              style={{
                                ...xs.revFillAns,
                                color: ok ? "#16a34a" : "#dc2626",
                                borderColor: ok ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {(Array.isArray(sa) ? sa[bi] : "") || "—"}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                      {examQ.hint && (
                        <>
                          <br />
                          <strong>{examQ.hint}</strong>
                        </>
                      )}
                    </div>
                    {!ok && (
                      <p style={xs.revCorrectLine}>
                        Correcta: <span style={{ color: "#16a34a", fontWeight: 700 }}>{examQ.correct}</span>
                      </p>
                    )}
                  </>
                )}

                <div style={xs.navRow}>
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    style={{
                      ...xs.btnPrev,
                      opacity: currentIndex === 0 ? 0.4 : 1,
                      cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    ← Anterior
                  </button>
                  <button onClick={goSig} style={xs.btnNext}>
                    {currentIndex >= total - 1 ? "Ver feedback →" : "Siguiente →"}
                  </button>
                </div>
              </main>

              {!isMobile && (
                <aside style={xs.sidebar}>
                  <div style={xs.stepperCard}>
                    {winQs.map((q, j) => {
                      const posInPart = winStart + j;
                      const globalIdx = partStartGlobal + posInPart;
                      const done = posInPart <= idxInPart;
                      const isCur = posInPart === idxInPart;
                      return (
                        <div
                          key={q.id}
                          onClick={() => { setCurrentIndex(globalIdx); setError(null); }}
                          style={{ display: "flex", alignItems: "center", gap: 12, height: 34, cursor: "pointer" }}
                        >
                          <div style={{ position: "relative", width: 18, height: 34, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {j > 0 && (
                              <div style={{ position: "absolute", top: 0, height: 17, width: 2, background: posInPart <= idxInPart ? "#FF327D" : "#d8cfe8" }} />
                            )}
                            {j < winQs.length - 1 && (
                              <div style={{ position: "absolute", top: 17, height: 17, width: 2, background: posInPart < idxInPart ? "#FF327D" : "#d8cfe8" }} />
                            )}
                            <div style={{
                              width: isCur ? 15 : 13, height: isCur ? 15 : 13, borderRadius: "50%", zIndex: 1,
                              background: done ? "#FF327D" : "#fff",
                              border: done ? "none" : "2px solid #cfc6e6",
                              boxShadow: isCur ? "0 0 0 4px rgba(255,50,125,0.18)" : "none",
                            }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: isCur ? 700 : 500, color: isCur ? "#2b2240" : (done ? "#6b6480" : "#b3abc6") }}>
                            Ejercicio {posInPart + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              )}
            </div>
          </div>
        );
      })()}


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotPulse { 0%,100%{transform:scale(0.6);opacity:0.3} 50%{transform:scale(1);opacity:1} }
        @keyframes confettiFall {
          0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(112vh) rotate(720deg); opacity: 1; }
        }
        .fb-scroll::-webkit-scrollbar { width: 8px; }
        .fb-scroll::-webkit-scrollbar-track { background: transparent; margin: 6px 0; }
        .fb-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 999px; }
        .fb-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.6); }
        .fb-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.4) transparent; }
        @keyframes particleDrift {
          0%{transform:translateY(0) translateX(0);opacity:0}
          10%{opacity:0.95}
          50%{transform:translateY(-50vh) translateX(10px);opacity:0.85}
          90%{opacity:0.5}
          100%{transform:translateY(-100vh) translateX(20px);opacity:0}
        }
        textarea:focus { outline: none; border-color: rgba(255,50,125,0.6) !important; }
        input:focus { outline: none; border-color: rgba(255,50,125,0.8) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(255,50,125,0.3); border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ─── Particles ─────────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 60 }, (_, i) => {
    const size = 2 + (i % 4);
    return {
      left: `${(i * 17 + 7) % 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      delay: `${(i * 0.7) % 12}s`,
      duration: `${9 + (i % 10)}s`,
      blur: i % 5 === 0 ? "1px" : "0",
    };
  });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p, i) => {
        const palette = i % 4;
        const bg =
          palette === 0 ? "rgba(255,50,125,0.6)"
          : palette === 1 ? "rgba(255,138,185,0.55)"
          : palette === 2 ? "rgba(184,107,196,0.5)"
          : "rgba(255,255,255,0.45)";
        const glow =
          palette === 0 ? "0 0 10px rgba(255,50,125,0.55)"
          : palette === 1 ? "0 0 8px rgba(255,138,185,0.5)"
          : palette === 2 ? "0 0 9px rgba(184,107,196,0.5)"
          : "0 0 6px rgba(255,255,255,0.35)";
        return (
          <div key={i} style={{
            position: "absolute", bottom: -10, left: p.left,
            width: p.width, height: p.height, borderRadius: "50%",
            background: bg,
            boxShadow: glow,
            filter: `blur(${p.blur})`,
            animation: `particleDrift ${p.duration} ${p.delay} infinite linear`,
          }} />
        );
      })}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a0a2e 0%, #2d1248 40%, #1a0a2e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    color: "white",
    position: "relative",
  },
  // Fondo fijo que cubre el viewport completo aunque haya scroll (evita que se
  // vea el fondo claro del body en páginas largas como el examen).
  bgFixed: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    background: "linear-gradient(135deg, #1a0a2e 0%, #2d1248 40%, #1a0a2e 100%)",
  },

  // Name screen
  nameCard: {
    position: "relative", zIndex: 1,
    maxWidth: 480, margin: "0 auto", padding: "100px 24px 60px",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    animation: "fadeUp 0.6s ease both",
  },
  logoMark: { fontSize: 36, color: "#ff327d", marginBottom: 24, animation: "float 3s ease-in-out infinite" },
  nameTitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 700, lineHeight: 1.15, marginBottom: 12,
    background: "linear-gradient(135deg, #ff8ab9, #ff327d, #b86bc4)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  nameSubtitle: { color: "rgba(255,255,255,0.45)", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 40 },
  nameDivider: { width: 60, height: 1, background: "rgba(255,50,125,0.3)", marginBottom: 40 },
  nameLabel: { color: "rgb(255, 255, 255)", fontSize: 14, marginBottom: 12, alignSelf: "flex-start" },
  nameInput: {
    width: "100%", padding: "14px 18px", fontSize: 16,
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,50,125,0.25)",
    borderRadius: 12, color: "white", marginBottom: 16,
    transition: "border-color 0.2s",
  },
  startBtn: {
    width: "100%", padding: "15px 24px", fontSize: 16, fontWeight: 600,
    background: "linear-gradient(135deg, #ff327d, #b86bc4)",
    border: "none", borderRadius: 12, color: "white", cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 4px 24px rgba(255,50,125,0.4)",
  },
  nameNote: { marginTop: 20, color: "rgba(255,255,255,0.3)", fontSize: 13 },
  hubPrompt: { color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 28 },
  hubBtnPrimary: {
    width: "100%", padding: "16px 24px", fontSize: 16, fontWeight: 600,
    background: "linear-gradient(135deg, #ff327d, #b86bc4)",
    border: "none", borderRadius: 12, color: "white", cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 4px 24px rgba(255,50,125,0.4)", marginBottom: 14,
  },
  hubBtnSecondary: {
    width: "100%", padding: "16px 24px", fontSize: 16, fontWeight: 600,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,50,125,0.35)", borderRadius: 12,
    color: "#ffb8d1", cursor: "pointer", transition: "all 0.15s",
  },
  emailError: {
    alignSelf: "flex-start", color: "#fca5a5", fontSize: 13,
    marginTop: 0, marginBottom: 16, lineHeight: 1.4,
  },

  // ── Login (nuevo diseño) ──
  loginPage: {
    minHeight: "100vh",
    background: "#41276B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    position: "relative",
    fontFamily: "'DM Sans', sans-serif",
    color: "white",
  },
  loginBg: { position: "fixed", inset: 0, zIndex: 0, background: "#41276B" },
  loginCard: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 440,
    background: "linear-gradient(150deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.11) 100%)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 26,
    padding: "48px 46px 38px",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    animation: "fadeUp 0.5s ease both",
  },
  loginWelcome: {
    textAlign: "center", fontSize: 15, fontWeight: 400, color: "#ffffff", margin: "0 0 10px",
  },
  loginTitle: {
    textAlign: "center",
    fontSize: "clamp(22px, 6vw, 30px)",
    fontWeight: 800,
    lineHeight: 1.1,
    margin: 0,
    whiteSpace: "nowrap",
    background: "linear-gradient(90deg, #ffffff 0%, #FF327D 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  loginSubtitle: {
    textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.92)",
    margin: "8px 0 28px", fontWeight: 400,
  },
  loginLabel: {
    fontSize: 14, color: "#ffffff", marginBottom: 8, fontWeight: 400, alignSelf: "flex-start",
  },
  loginInput: {
    width: "100%",
    padding: "13px 16px",
    fontSize: 14,
    background: "#ededed",
    border: "1px solid transparent",
    borderRadius: 11,
    color: "#333",
    marginBottom: 18,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  loginError: {
    color: "#ffb3c6", fontSize: 13, margin: "-10px 0 14px", lineHeight: 1.4,
  },
  loginBtn: {
    width: "100%",
    padding: "14px 24px",
    fontSize: 15,
    fontWeight: 700,
    background: "linear-gradient(90deg, #FF327D 0%, #6D2EBF 100%)",
    border: "2px solid #FF327D",
    borderRadius: 11,
    color: "white",
    marginTop: 6,
    boxShadow: "0 10px 34px rgba(255,50,125,0.4)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  loginLogo: {
    display: "block", margin: "26px auto 0", height: 54, width: "auto", opacity: 0.95,
  },

  // ── Intro al test ──
  introPage: {
    position: "relative",
    minHeight: "100vh",
    background: INTRO_BG,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'DM Sans', sans-serif",
    color: "white",
    padding: 24,
  },
  introBg: { position: "fixed", inset: 0, zIndex: 0, background: INTRO_BG },
  introClose: {
    position: "absolute", top: 22, right: 30, zIndex: 2,
    background: "none", border: "none", color: "rgba(255,255,255,0.85)",
    fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  introContent: {
    position: "relative", zIndex: 1,
    width: "100%", maxWidth: 800,
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
  },
  // El header se encoge al ancho del título; el aviso (width:0 + minWidth:100%)
  // toma exactamente ese ancho sin ensancharlo → ambos quedan alineados.
  introHeader: {
    maxWidth: "100%", textAlign: "left", marginBottom: 54,
  },
  introTitle: {
    fontSize: "clamp(24px, 5.2vw, 44px)", fontWeight: 800, color: "#fff",
    margin: "0 0 18px", lineHeight: 1.1, whiteSpace: "nowrap", textAlign: "left",
  },
  introInfo: {
    display: "flex", gap: 11, alignItems: "flex-start",
    width: 0, minWidth: "100%", textAlign: "left", margin: 0,
  },
  introInfoIcon: {
    flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,0.55)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginTop: 2,
  },
  introInfoText: {
    fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", margin: 0,
  },
  introDuration: {
    fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 16px",
  },
  introBtn: {
    width: "100%", maxWidth: 320,
    padding: "15px 24px", fontSize: 16, fontWeight: 700,
    background: "linear-gradient(90deg, #FF327D 0%, #6D2EBF 100%)",
    border: "2px solid #FF327D", borderRadius: 12, color: "white", cursor: "pointer",
    boxShadow: "0 10px 34px rgba(255,50,125,0.4)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },

  // ── Menú (hub) nuevo diseño ──
  hubPage: {
    minHeight: "100vh",
    background: "#ffffff url('/FONDO.png') center center / cover no-repeat fixed",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex", flexDirection: "column",
  },
  hubTopbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 28px",
    background: "linear-gradient(90deg, #41276B 0%, #613BA0 55%, #E9407E 100%)",
  },
  hubLogo: { height: 42, width: "auto" },
  hubTopbarRight: { display: "flex", alignItems: "center", gap: 14 },
  hubLogout: {
    background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff", fontSize: 14, fontWeight: 500, padding: "8px 18px",
    borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  hubAvatar: {
    width: 38, height: 38, borderRadius: "50%", background: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  hubMain: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  hubTitle: {
    fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, color: "#41276B",
    margin: "0 0 6px", textAlign: "center",
  },
  hubSubtitle: {
    fontSize: 15, color: "#5b5b6b", margin: "0 0 46px", textAlign: "center",
  },
  hubError: { color: "#e11d48", fontSize: 14, marginBottom: 16 },
  hubImgBtn: {
    background: "none", border: "none", padding: 0, margin: "0 0 26px",
    cursor: "pointer", width: "100%", maxWidth: 580, display: "block",
    transition: "transform 0.15s",
  },
  hubImg: { width: "100%", height: "auto", display: "block" },

  // Header
  header: {
    position: "sticky", top: 0, zIndex: 10,
    background: "rgba(26,10,46,0.85)", backdropFilter: "blur(20px)",
    padding: "16px 0",
  },
  headerInner: {
    maxWidth: 860, margin: "0 auto", padding: "0 20px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    flexWrap: "wrap",
  },
  headerLogo: { fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#ffffff" },
  headerStudent: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  progressWrap: { flex: 1, minWidth: 200, maxWidth: 360 },
  progressInfo: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" },
  progressPct: { fontSize: 13, fontWeight: 600, color: "#ff327d" },
  progressBar: {
    height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #ff327d, #b86bc4, #ff8ab9)",
    borderRadius: 99, transition: "width 0.4s ease",
  },
  progressSub: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 5, textAlign: "right" },

  // Tabs
  tabRow: {
    maxWidth: 860, margin: "24px auto 0", padding: "0 20px",
    display: "flex", gap: 8, position: "relative", zIndex: 1,
  },
  tab: {
    flex: 1, padding: "12px 16px", fontSize: 14, fontWeight: 500,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, color: "rgba(255,255,255,0.45)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.2s",
  },
  tabActive: {
    background: "rgba(255,50,125,0.2)", border: "1px solid rgba(255,50,125,0.35)",
    color: "#ffb8d1",
  },
  tabDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    color: "rgba(255,255,255,0.35)",
  },
  tabLock: { fontSize: 12, marginRight: 2 },
  tabBadge: (complete) => ({
    fontSize: 11, padding: "2px 8px", borderRadius: 99,
    background: complete ? "rgba(255,50,125,0.25)" : "rgba(255,255,255,0.08)",
    color: complete ? "#ff8ab9" : "rgba(255,255,255,0.35)",
  }),

  // Main
  main: { maxWidth: 860, margin: "0 auto", padding: "24px 20px 80px", position: "relative", zIndex: 1 },
  questionList: { display: "flex", flexDirection: "column", gap: 20 },

  // Question card
  questionCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "28px 28px 24px",
    transition: "border-color 0.2s",
    animation: "fadeUp 0.4s ease both",
  },
  questionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  questionNumber: {
    width: 32, height: 32, borderRadius: 8,
    background: "rgba(255,50,125,0.25)", border: "1px solid rgba(255,50,125,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#ff8ab9",
  },
  questionBadge: {
    fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500,
    background: "rgba(255,50,125,0.18)", color: "#ff8ab9", letterSpacing: "0.06em",
  },
  questionText: { fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", marginBottom: 20 },

  // MC Options
  optionsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: {
    display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 15,
    textAlign: "left", transition: "all 0.15s", width: "100%",
  },
  optionBtnSelected: {
    background: "rgba(255,50,125,0.18)", border: "1px solid rgba(255,50,125,0.45)",
    color: "#ffb8d1",
  },
  optionLetter: {
    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)",
  },
  optionLetterSelected: {
    background: "rgba(255,50,125,0.4)", border: "1px solid rgba(255,50,125,0.5)",
    color: "#ff8ab9",
  },
  optionText: { flex: 1 },
  checkIcon: { color: "#ff327d", fontSize: 16, fontWeight: 700 },

  // Fill in the blank
  fillSentenceBox: {
    padding: "16px 20px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, fontSize: 16, lineHeight: 1.9,
    color: "rgba(255,255,255,0.88)",
  },
  fillSentenceText: { fontSize: 16, color: "rgba(255,255,255,0.88)" },
  fillInput: {
    display: "inline-block",
    padding: "0 4px",
    margin: "0 2px",
    fontSize: 16,
    lineHeight: 1.4,
    background: "transparent",
    border: "none",
    borderBottom: "2px solid rgba(255,50,125,0.55)",
    borderRadius: 0,
    color: "#ffb8d1",
    fontWeight: 600,
    minWidth: 120,
    width: "auto",
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "center",
    verticalAlign: "baseline",
    transition: "border-color 0.2s",
  },

  // Textarea
  textarea: {
    width: "100%", padding: "14px 16px", fontSize: 15, lineHeight: 1.7,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "rgba(255,255,255,0.85)", resize: "vertical",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
  },
  wordCountRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 10 },
  wordBar: {
    flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden",
  },
  wordBarFill: { height: "100%", borderRadius: 99, transition: "width 0.3s ease" },
  wordCount: { fontSize: 12, whiteSpace: "nowrap", minWidth: 100, textAlign: "right" },

  // Nav buttons
  nextTabBtn: {
    alignSelf: "flex-end", padding: "12px 24px", fontSize: 14, fontWeight: 600,
    background: "rgba(255,50,125,0.2)", border: "1px solid rgba(255,50,125,0.3)",
    borderRadius: 10, color: "#ff8ab9", cursor: "pointer", transition: "all 0.2s",
  },
  errorBox: {
    padding: "14px 18px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10, color: "#fca5a5", fontSize: 14,
  },
  securityOverlay: {
    position: "fixed", inset: 0, zIndex: 400, display: "flex",
    alignItems: "center", justifyContent: "center", padding: 24,
    background: "rgba(30,20,50,0.25)",
    backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
    animation: "fadeUp 0.2s ease both",
  },
  securityToast: {
    maxWidth: 460, padding: "20px 30px",
    background: "linear-gradient(90deg, #ef4444, #dc2626)", color: "white",
    borderRadius: 16, fontSize: 16, fontWeight: 600, textAlign: "center",
    lineHeight: 1.45, boxShadow: "0 16px 50px rgba(0,0,0,0.3)",
  },
  submitBtn: {
    width: "100%", padding: "18px 24px", fontSize: 17, fontWeight: 700,
    background: "linear-gradient(135deg, #ff327d, #b86bc4, #ff8ab9)",
    border: "none", borderRadius: 14, color: "white", cursor: "pointer",
    boxShadow: "0 8px 32px rgba(255,50,125,0.45)",
    transition: "transform 0.15s, box-shadow 0.15s",
    letterSpacing: "0.02em",
  },

  // Loading overlay
  loadingOverlay: {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(26,10,46,0.88)", backdropFilter: "blur(20px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loadingCard: {
    textAlign: "center", padding: "56px 48px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,50,125,0.2)",
    borderRadius: 24, maxWidth: 360, width: "90%",
    animation: "fadeUp 0.4s ease both",
  },
  ringWrap: { position: "relative", width: 112, height: 112, margin: "0 auto 28px" },
  ringPct: {
    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, fontWeight: 700, color: "white",
  },
  loadingTitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700,
    color: "white", marginBottom: 10,
  },
  loadingText: { color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 24 },
  loadingDots: { display: "flex", gap: 8, justifyContent: "center" },
  dot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#ff327d",
    display: "inline-block",
    animation: "dotPulse 1.2s ease-in-out infinite",
  },

  // Result
  resultOverlay: {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(26,10,46,0.9)", backdropFilter: "blur(20px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "clamp(10px, 3vw, 20px)",
    overflowY: "auto",
  },
  resultCard: {
    position: "relative", maxWidth: "min(740px, 95vw)", width: "100%",
    maxHeight: "90vh", overflowY: "auto",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,50,125,0.25)",
    borderRadius: 20,
    padding: "clamp(24px, 5vw, 40px) clamp(18px, 4vw, 32px) clamp(20px, 4vw, 32px)",
    textAlign: "center", animation: "fadeUp 0.5s ease both",
  },
  resultGlow: { display: "none" },
  resultScoreCircle: {
    width: 84, height: 84, borderRadius: "50%", margin: "0 auto 18px",
    background: "linear-gradient(135deg, #ff327d, #b86bc4)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  resultScoreNum: { fontSize: 24, fontWeight: 800, color: "white", lineHeight: 1 },
  resultScoreLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" },
  resultTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 700, color: "white", marginBottom: 6 },
  resultSubtitle: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 22 },
  resultFeedbackBox: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "18px 20px", marginBottom: 20, textAlign: "left",
  },
  resultFeedbackLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 },
  resultFeedbackText: { fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 },
  detailsBtn: {
    width: "100%", padding: "13px 20px", fontSize: 14, fontWeight: 600,
    background: "rgba(255,50,125,0.18)", border: "1px solid rgba(255,50,125,0.3)",
    borderRadius: 10, color: "#ff8ab9", cursor: "pointer", marginBottom: 12,
    transition: "all 0.2s",
  },
  detailsBox: {
    background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px",
    maxHeight: 240, overflowY: "auto", textAlign: "left", marginBottom: 12,
  },
  detailItem: { display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" },
  detailQ: { fontSize: 12, fontWeight: 700, color: "#ff327d", whiteSpace: "nowrap", marginTop: 1 },
  closeBtn: {
    width: "100%", padding: "15px 24px", fontSize: 15, fontWeight: 700,
    background: "linear-gradient(135deg, #ff327d, #ff8ab9)",
    border: "none", borderRadius: 12, color: "white", cursor: "pointer",
    boxShadow: "0 4px 20px rgba(255,50,125,0.35)",
  },

  // Review mode
  reviewOverlay: {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(26,10,46,0.95)", backdropFilter: "blur(20px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "clamp(10px, 3vw, 20px)",
    overflowY: "auto",
  },
  reviewCard: {
    position: "relative", maxWidth: "min(620px, 95vw)", width: "100%",
    maxHeight: "92vh", overflowY: "auto",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,50,125,0.25)",
    borderRadius: 20,
    padding: "clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 28px) clamp(20px, 4vw, 28px)",
    textAlign: "center", animation: "fadeUp 0.5s ease both",
  },
  reviewHeader: { marginBottom: 18 },
  reviewTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 700, color: "white", marginBottom: 6 },
  reviewSubtitle: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16 },
  backToResultBtn: {
    padding: "10px 20px", fontSize: 14, fontWeight: 500,
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, color: "rgba(255,255,255,0.8)", cursor: "pointer",
  },
  reviewLegend: { display: "flex", gap: 16, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" },
  legendItem: {
    display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  legendDot: { width: 10, height: 10, borderRadius: "50%" },
  reviewQuestions: { display: "flex", flexDirection: "column", gap: 12, textAlign: "left" },
  reviewQuestionCard: {
    background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.1)",
    borderRadius: 14, padding: "clamp(14px, 3vw, 18px) clamp(14px, 3vw, 20px)",
  },
  reviewQuestionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  reviewQuestionNumber: {
    width: 32, height: 32, borderRadius: 8,
    background: "rgba(255,50,125,0.25)", border: "1px solid rgba(255,50,125,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#ff8ab9",
  },
  reviewBadge: { fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500, letterSpacing: "0.06em" },
  reviewQuestionText: { fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", marginBottom: 16 },
  reviewOptionsGrid: { display: "flex", flexDirection: "column", gap: 8 },
  reviewOptionBtn: {
    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, width: "100%",
  },
  reviewOptionLetter: {
    width: 26, height: 26, borderRadius: 6, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700,
  },
  reviewOptionText: { flex: 1, fontSize: 14 },
  reviewOpenAnswer: { background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 16 },
  reviewOpenLabel: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8 },
  reviewOpenText: { fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, whiteSpace: "pre-wrap" },
};
