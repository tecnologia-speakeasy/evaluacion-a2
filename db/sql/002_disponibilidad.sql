-- =============================================================================
-- Disponibilidad semanal por profesor (día de semana + franja de 30 min).
-- dia_semana usa ISO DOW: 1=Lunes ... 7=Domingo (coincide con extract(isodow)).
-- Se rellena desde db/disponibilidad.json con el script de seed.
-- Idempotente.
-- =============================================================================

CREATE TABLE IF NOT EXISTS agendamiento.disponibilidad (
  profesor_id  int  NOT NULL REFERENCES agendamiento.profesores(id) ON DELETE CASCADE,
  dia_semana   int  NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio  time NOT NULL,
  PRIMARY KEY (profesor_id, dia_semana, hora_inicio)
);

-- Búsqueda rápida de "quién está disponible en este día+hora".
CREATE INDEX IF NOT EXISTS ix_disponibilidad_dia_hora
  ON agendamiento.disponibilidad (dia_semana, hora_inicio);
