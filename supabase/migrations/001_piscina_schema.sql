-- =============================================
-- PISCINA LA FAMILIA — Schema aislado "piscina"
-- Ejecutar en Supabase SQL Editor
-- Compatible con proyecto compartido eafaldhtcebaiujftqei
-- =============================================

CREATE SCHEMA IF NOT EXISTS piscina;

-- Sedes / Ubicaciones
CREATE TABLE IF NOT EXISTS piscina.locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  phone         TEXT,
  capacity_max  INTEGER NOT NULL DEFAULT 40,
  description   TEXT,
  amenities     TEXT[],
  images        TEXT[],
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tipos de reserva
CREATE TABLE IF NOT EXISTS piscina.reservation_types (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  price_base      NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_hours  INTEGER NOT NULL DEFAULT 0,
  requires_quote  BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bloques horarios disponibles por sede
CREATE TABLE IF NOT EXISTS piscina.time_blocks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id  UUID NOT NULL REFERENCES piscina.locations(id) ON DELETE CASCADE,
  day_of_week  INTEGER[] NOT NULL, -- 0=Dom, 1=Lun, ..., 6=Sáb
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  capacity     INTEGER,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS piscina.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  dni         TEXT,
  role        TEXT NOT NULL DEFAULT 'client'
                CHECK (role IN ('client', 'admin', 'staff')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservas confirmadas
CREATE TABLE IF NOT EXISTS piscina.reservations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id           UUID REFERENCES piscina.profiles(id) ON DELETE SET NULL,
  location_id          UUID NOT NULL REFERENCES piscina.locations(id),
  reservation_type_id  UUID NOT NULL REFERENCES piscina.reservation_types(id),
  time_block_id        UUID NOT NULL REFERENCES piscina.time_blocks(id),
  reservation_date     DATE NOT NULL,
  num_adults           INTEGER NOT NULL DEFAULT 1,
  num_children         INTEGER NOT NULL DEFAULT 0,
  total_price          NUMERIC(10,2) NOT NULL DEFAULT 0,
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','confirmed','cancelled','completed','no_show')),
  notes                TEXT,
  qr_code              TEXT,
  checked_in_at        TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ,
  cancellation_reason  TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Solicitudes de cotización (cumpleaños, eventos, grupos)
CREATE TABLE IF NOT EXISTS piscina.quote_requests (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id           UUID REFERENCES piscina.profiles(id) ON DELETE SET NULL,
  location_id          UUID NOT NULL REFERENCES piscina.locations(id),
  reservation_type_id  UUID NOT NULL REFERENCES piscina.reservation_types(id),
  name                 TEXT NOT NULL,
  email                TEXT NOT NULL,
  phone                TEXT NOT NULL,
  event_date           DATE,
  num_guests           INTEGER,
  event_details        TEXT,
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','reviewing','quoted','accepted','rejected')),
  quoted_price         NUMERIC(10,2),
  admin_notes          TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fechas bloqueadas / mantenimiento
CREATE TABLE IF NOT EXISTS piscina.blocked_dates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id   UUID REFERENCES piscina.locations(id) ON DELETE CASCADE,
  blocked_date  DATE NOT NULL,
  reason        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION piscina.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'piscina_reservations_updated_at') THEN
    CREATE TRIGGER piscina_reservations_updated_at
      BEFORE UPDATE ON piscina.reservations
      FOR EACH ROW EXECUTE FUNCTION piscina.update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'piscina_quotes_updated_at') THEN
    CREATE TRIGGER piscina_quotes_updated_at
      BEFORE UPDATE ON piscina.quote_requests
      FOR EACH ROW EXECUTE FUNCTION piscina.update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'piscina_profiles_updated_at') THEN
    CREATE TRIGGER piscina_profiles_updated_at
      BEFORE UPDATE ON piscina.profiles
      FOR EACH ROW EXECUTE FUNCTION piscina.update_updated_at();
  END IF;
END;
$$;

-- Trigger: crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION piscina.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO piscina.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'piscina_on_auth_user_created') THEN
    CREATE TRIGGER piscina_on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION piscina.handle_new_user();
  END IF;
END;
$$;

-- Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_piscina_reservations_date
  ON piscina.reservations (reservation_date);
CREATE INDEX IF NOT EXISTS idx_piscina_reservations_location
  ON piscina.reservations (location_id);
CREATE INDEX IF NOT EXISTS idx_piscina_reservations_profile
  ON piscina.reservations (profile_id);
CREATE INDEX IF NOT EXISTS idx_piscina_reservations_status
  ON piscina.reservations (status);
CREATE INDEX IF NOT EXISTS idx_piscina_quotes_status
  ON piscina.quote_requests (status);
CREATE INDEX IF NOT EXISTS idx_piscina_blocked_dates
  ON piscina.blocked_dates (blocked_date, location_id);
