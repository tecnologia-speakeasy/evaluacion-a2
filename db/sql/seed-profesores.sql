-- Precarga de los 6 profesores. Idempotente por 'slug'.
INSERT INTO agendamiento.profesores (nombre, slug) VALUES
  ('Alejandra Rivera Cruz',           'alejandra-rivera-cruz'),
  ('Christian Camilo Velilla Cepeda', 'christian-velilla-cepeda'),
  ('Daniel Felipe Moreno Camargo',    'daniel-moreno-camargo'),
  ('Daniel Felipe Valencia Eraso',    'daniel-valencia-eraso'),
  ('David Alejandro Quiroga Orozco',  'david-quiroga-orozco'),
  ('Paula Andrea Londoño Trujillo',   'paula-londono-trujillo')
ON CONFLICT (slug) DO NOTHING;
