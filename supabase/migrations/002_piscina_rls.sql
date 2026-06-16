-- =============================================
-- PISCINA LA FAMILIA — Row Level Security
-- Ejecutar después de 001_piscina_schema.sql
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE piscina.locations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE piscina.reservation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE piscina.time_blocks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE piscina.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE piscina.reservations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE piscina.quote_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE piscina.blocked_dates    ENABLE ROW LEVEL SECURITY;

-- Helper: verificar si el usuario actual es admin o staff
CREATE OR REPLACE FUNCTION piscina.is_admin_or_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM piscina.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'staff')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- LOCATIONS: lectura pública, escritura solo admin
-- =============================================
DROP POLICY IF EXISTS piscina_locations_select ON piscina.locations;
CREATE POLICY piscina_locations_select ON piscina.locations
  FOR SELECT USING (is_active = true OR piscina.is_admin_or_staff());

DROP POLICY IF EXISTS piscina_locations_admin ON piscina.locations;
CREATE POLICY piscina_locations_admin ON piscina.locations
  FOR ALL USING (piscina.is_admin_or_staff());

-- =============================================
-- RESERVATION_TYPES: lectura pública, escritura admin
-- =============================================
DROP POLICY IF EXISTS piscina_res_types_select ON piscina.reservation_types;
CREATE POLICY piscina_res_types_select ON piscina.reservation_types
  FOR SELECT USING (is_active = true OR piscina.is_admin_or_staff());

DROP POLICY IF EXISTS piscina_res_types_admin ON piscina.reservation_types;
CREATE POLICY piscina_res_types_admin ON piscina.reservation_types
  FOR ALL USING (piscina.is_admin_or_staff());

-- =============================================
-- TIME_BLOCKS: lectura pública, escritura admin
-- =============================================
DROP POLICY IF EXISTS piscina_time_blocks_select ON piscina.time_blocks;
CREATE POLICY piscina_time_blocks_select ON piscina.time_blocks
  FOR SELECT USING (is_active = true OR piscina.is_admin_or_staff());

DROP POLICY IF EXISTS piscina_time_blocks_admin ON piscina.time_blocks;
CREATE POLICY piscina_time_blocks_admin ON piscina.time_blocks
  FOR ALL USING (piscina.is_admin_or_staff());

-- =============================================
-- PROFILES: cada usuario ve y edita solo el suyo; admin ve todos
-- =============================================
DROP POLICY IF EXISTS piscina_profiles_select_own ON piscina.profiles;
CREATE POLICY piscina_profiles_select_own ON piscina.profiles
  FOR SELECT USING (id = auth.uid() OR piscina.is_admin_or_staff());

DROP POLICY IF EXISTS piscina_profiles_update_own ON piscina.profiles;
CREATE POLICY piscina_profiles_update_own ON piscina.profiles
  FOR UPDATE USING (id = auth.uid() OR piscina.is_admin_or_staff());

DROP POLICY IF EXISTS piscina_profiles_insert ON piscina.profiles;
CREATE POLICY piscina_profiles_insert ON piscina.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- =============================================
-- RESERVATIONS: cliente ve las suyas; admin ve todas
-- =============================================
DROP POLICY IF EXISTS piscina_reservations_select ON piscina.reservations;
CREATE POLICY piscina_reservations_select ON piscina.reservations
  FOR SELECT USING (
    profile_id = auth.uid() OR piscina.is_admin_or_staff()
  );

DROP POLICY IF EXISTS piscina_reservations_insert ON piscina.reservations;
CREATE POLICY piscina_reservations_insert ON piscina.reservations
  FOR INSERT WITH CHECK (
    profile_id = auth.uid() OR piscina.is_admin_or_staff()
  );

DROP POLICY IF EXISTS piscina_reservations_update ON piscina.reservations;
CREATE POLICY piscina_reservations_update ON piscina.reservations
  FOR UPDATE USING (
    profile_id = auth.uid() OR piscina.is_admin_or_staff()
  );

-- =============================================
-- QUOTE_REQUESTS: cliente ve las suyas; admin ve todas
-- =============================================
DROP POLICY IF EXISTS piscina_quotes_select ON piscina.quote_requests;
CREATE POLICY piscina_quotes_select ON piscina.quote_requests
  FOR SELECT USING (
    profile_id = auth.uid() OR piscina.is_admin_or_staff()
  );

DROP POLICY IF EXISTS piscina_quotes_insert ON piscina.quote_requests;
CREATE POLICY piscina_quotes_insert ON piscina.quote_requests
  FOR INSERT WITH CHECK (true); -- Permite sin auth (formulario público)

DROP POLICY IF EXISTS piscina_quotes_update ON piscina.quote_requests;
CREATE POLICY piscina_quotes_update ON piscina.quote_requests
  FOR UPDATE USING (piscina.is_admin_or_staff());

-- =============================================
-- BLOCKED_DATES: lectura pública, escritura admin
-- =============================================
DROP POLICY IF EXISTS piscina_blocked_dates_select ON piscina.blocked_dates;
CREATE POLICY piscina_blocked_dates_select ON piscina.blocked_dates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS piscina_blocked_dates_admin ON piscina.blocked_dates;
CREATE POLICY piscina_blocked_dates_admin ON piscina.blocked_dates
  FOR ALL USING (piscina.is_admin_or_staff());
