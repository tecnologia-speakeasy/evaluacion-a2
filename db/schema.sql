-- ─────────────────────────────────────────────────────────────────────────────
-- Tabla de evaluaciones
--
-- Diseño: las preguntas se guardan como columnas genéricas p1..p10 (no por su
-- texto), porque el contenido de las preguntas puede cambiar entre evaluaciones.
-- Cada columna guarda el puntaje de esa pregunta:
--   · Preguntas objetivas  -> 0 o 10
--   · Preguntas abiertas    -> 0 a 10 (puntaje que asigna la IA / n8n)
--
-- Para AÑADIR más preguntas en el futuro:
--   ALTER TABLE evaluaciones ADD COLUMN p11 SMALLINT NOT NULL DEFAULT 0;
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS evaluaciones (
  id            SERIAL PRIMARY KEY,

  -- Datos del estudiante
  nombre        TEXT        NOT NULL,
  email         TEXT        NOT NULL,

  -- Resultado general (puntaje global 0..100)
  puntaje_total SMALLINT    NOT NULL DEFAULT 0,

  -- Respuestas crudas del estudiante (TODAS en un JSON, por id de pregunta) y
  -- feedback de IA. Se guardan como JSON para no atar el esquema al número/orden
  -- de preguntas. El detalle por pregunta se recalcula desde aquí cuando hace falta.
  respuestas    JSONB,
  feedback      TEXT,

  -- Estado del procesamiento: 'pendiente' | 'calificando' | 'listo' | 'error'
  estado        TEXT        NOT NULL DEFAULT 'pendiente',
  email_enviado BOOLEAN     NOT NULL DEFAULT FALSE,

  -- Anti-trampa: veces que el estudiante salió de la pestaña durante el examen.
  cambios_pestana SMALLINT  NOT NULL DEFAULT 0,

  -- Token aleatorio para el enlace público de resultados (/resultado/[token]).
  token         TEXT UNIQUE,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

-- Índices para consultar resultados rápido desde DBeaver / la app
CREATE INDEX IF NOT EXISTS idx_evaluaciones_email      ON evaluaciones (email);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_created_at ON evaluaciones (created_at DESC);


-- ─────────────────────────────────────────────────────────────────────────────
-- Lista blanca de estudiantes autorizados
--
-- Solo los correos en esta tabla pueden iniciar y enviar la evaluación.
-- Los correos se guardan en minúsculas (la app normaliza antes de comparar).
-- Cargar la lista con:  npm run db:load-emails -- ruta/al/archivo.csv
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS estudiantes_autorizados (
  id          SERIAL PRIMARY KEY,
  email       TEXT        NOT NULL UNIQUE,
  manychat_id TEXT,                          -- ID del contacto en ManyChat (WhatsApp)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
