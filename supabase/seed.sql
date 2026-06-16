-- =============================================
-- PISCINA LA FAMILIA — Seed inicial
-- Ejecutar después de 001 y 002
-- =============================================

-- Sedes
INSERT INTO piscina.locations (name, address, phone, capacity_max, description, amenities)
VALUES
  (
    'Sierra Maestra',
    'Calle 22 entre Av. 10 y 12, San Francisco, Zulia',
    '0412-549-7463',
    40,
    'Nuestra sede principal en San Francisco. Piscina semiolímpica con área de descanso, parrilleras y estacionamiento privado.',
    ARRAY['Parrilleras', 'Vestuarios', 'Estacionamiento', 'Área infantil', 'WiFi', 'Neveras disponibles']
  ),
  (
    'Los Cortijos',
    'Kilómetro 12, Los Cortijos, Maracaibo',
    '0412-105-5663',
    40,
    'Sede Los Cortijos, ideal para grupos y eventos especiales. Rodeada de naturaleza con piscina de diseño.',
    ARRAY['Parrilleras', 'Vestuarios', 'Estacionamiento amplio', 'Área de eventos', 'Rancho techado']
  )
ON CONFLICT DO NOTHING;

-- Tipos de reserva
INSERT INTO piscina.reservation_types (name, description, price_base, duration_hours, requires_quote, sort_order)
VALUES
  (
    'Reserva por Horas',
    'Ideal para disfrutar la piscina en un bloque de 3 horas. Perfecto para parejas o grupos pequeños.',
    0, 3, false, 1
  ),
  (
    'Reserva Familiar Privada',
    'Disfruta la piscina de forma privada durante 6 horas. Incluye uso de parrilleras y área de descanso.',
    0, 6, false, 2
  ),
  (
    'Cumpleaños',
    'Celebra tu cumpleaños en grande. Incluye 4 horas exclusivas, decoración básica y asistencia del equipo.',
    0, 4, true, 3
  ),
  (
    'Evento Privado',
    'Para empresas, graduaciones, reuniones y cualquier evento especial. Cotización personalizada.',
    0, 0, true, 4
  ),
  (
    'Grupo Especial',
    'Para grupos de más de 20 personas: deportivos, escolares, corporativos. Precio especial por volumen.',
    0, 0, true, 5
  )
ON CONFLICT DO NOTHING;

-- Bloques horarios (se insertan después de obtener los IDs de las sedes)
DO $$
DECLARE
  sierra_id   UUID;
  cortijos_id UUID;
BEGIN
  SELECT id INTO sierra_id   FROM piscina.locations WHERE name = 'Sierra Maestra'  LIMIT 1;
  SELECT id INTO cortijos_id FROM piscina.locations WHERE name = 'Los Cortijos'    LIMIT 1;

  -- Sierra Maestra
  INSERT INTO piscina.time_blocks (location_id, day_of_week, start_time, end_time, price)
  VALUES
    (sierra_id, ARRAY[0,1,2,3,4,5,6], '09:00', '12:00', 0),
    (sierra_id, ARRAY[0,1,2,3,4,5,6], '13:00', '16:00', 0),
    (sierra_id, ARRAY[5,6],           '17:00', '20:00', 0)
  ON CONFLICT DO NOTHING;

  -- Los Cortijos
  INSERT INTO piscina.time_blocks (location_id, day_of_week, start_time, end_time, price)
  VALUES
    (cortijos_id, ARRAY[0,1,2,3,4,5,6], '09:00', '12:00', 0),
    (cortijos_id, ARRAY[0,1,2,3,4,5,6], '13:00', '16:00', 0)
  ON CONFLICT DO NOTHING;
END;
$$;
