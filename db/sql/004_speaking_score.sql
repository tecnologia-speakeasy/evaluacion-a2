-- Puntaje de SPEAKING (máx 30). Lo evalúan los profes en videollamada y se
-- carga MANUALMENTE. Vive por EMAIL (independiente de la evaluación) para poder
-- registrarlo aunque el estudiante todavía no haya presentado el examen.
--
-- Cargar / actualizar el puntaje de un estudiante (email en minúsculas):
--   INSERT INTO speaking_scores (email, score) VALUES ('correo@x.com', 25)
--   ON CONFLICT (email) DO UPDATE SET score = EXCLUDED.score, updated_at = now();
CREATE TABLE IF NOT EXISTS speaking_scores (
  email      text PRIMARY KEY,
  score      int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
