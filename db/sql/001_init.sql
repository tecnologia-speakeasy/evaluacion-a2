-- =============================================================================
-- Esquema AISLADO para el sistema de agendamiento.
-- No toca ninguna tabla del ERP en 'public'. Solo LEE public.estudiantes_autorizados.
-- Idempotente: se puede correr varias veces sin romper nada.
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS agendamiento;

-- Profesores -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agendamiento.profesores (
  id                  serial PRIMARY KEY,
  nombre              text NOT NULL,
  slug                text UNIQUE NOT NULL,
  foto_url            text,
  -- Credenciales Zoom Server-to-Server OAuth (una por profesor). Null hasta crearlas.
  zoom_account_id     text,
  zoom_client_id      text,
  zoom_client_secret  text,
  zoom_user_email     text,
  activo              boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Estudiantes que han ingresado/agendado (el nombre se captura en el login;
-- la autorización se valida contra public.estudiantes_autorizados) ----------
CREATE TABLE IF NOT EXISTS agendamiento.estudiantes (
  id          serial PRIMARY KEY,
  email       text UNIQUE NOT NULL,
  nombre      text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Citas ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agendamiento.citas (
  id              serial PRIMARY KEY,
  profesor_id     int NOT NULL REFERENCES agendamiento.profesores(id),
  estudiante_id   int NOT NULL REFERENCES agendamiento.estudiantes(id),
  fecha           date NOT NULL,
  hora_inicio     time NOT NULL,
  duracion_min    int NOT NULL DEFAULT 60,
  estado          text NOT NULL DEFAULT 'confirmada',  -- confirmada | cancelada
  zoom_meeting_id text,
  zoom_join_url   text,
  zoom_start_url  text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Un profesor NO puede tener dos citas activas en el mismo slot.
CREATE UNIQUE INDEX IF NOT EXISTS uq_profesor_slot_activa
  ON agendamiento.citas (profesor_id, fecha, hora_inicio)
  WHERE estado = 'confirmada';

-- Un estudiante solo puede tener UNA cita activa (si cancela, puede re-agendar).
CREATE UNIQUE INDEX IF NOT EXISTS uq_estudiante_activa
  ON agendamiento.citas (estudiante_id)
  WHERE estado = 'confirmada';

-- Índice para el cálculo de carga por profesor.
CREATE INDEX IF NOT EXISTS ix_citas_profesor_estado
  ON agendamiento.citas (profesor_id, estado);
