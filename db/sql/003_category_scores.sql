-- Puntajes por categoría en la evaluación:
--   writing_score = aciertos de completar + traducción (total 85)
--   grammar_score = aciertos de opción múltiple (total 30)
-- Se calculan al calificar (/api/submit). El total es fijo (85 y 30).
ALTER TABLE evaluaciones ADD COLUMN IF NOT EXISTS writing_score int;
ALTER TABLE evaluaciones ADD COLUMN IF NOT EXISTS grammar_score int;
