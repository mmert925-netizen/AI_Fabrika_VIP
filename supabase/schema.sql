-- ÖMER.AI Supabase Veri Kalıcılığı Şeması
-- Supabase Dashboard > SQL Editor'da bu dosyayı çalıştırın

-- Görsel galerisi (üretilen görseller)
CREATE TABLE IF NOT EXISTS omerai_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  src TEXT NOT NULL,
  serial_no INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_omerai_gallery_device ON omerai_gallery(device_id);
CREATE INDEX IF NOT EXISTS idx_omerai_gallery_created ON omerai_gallery(created_at DESC);

-- Kullanıcı tercihleri (token, tema, dil, portal, seri no)
CREATE TABLE IF NOT EXISTS omerai_preferences (
  device_id TEXT PRIMARY KEY,
  tokens INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'dark',
  lang TEXT DEFAULT 'tr',
  portal_stage INTEGER,
  portal_ts BIGINT,
  seal_serial INTEGER DEFAULT 4948,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Anon key ile erişim (device_id ile filtreleme client'ta)
ALTER TABLE omerai_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE omerai_preferences ENABLE ROW LEVEL SECURITY;

-- Herkes okuyup yazabilsin (device_id ile kendi verisini yönetir)
CREATE POLICY "Allow all for gallery" ON omerai_gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for preferences" ON omerai_preferences FOR ALL USING (true) WITH CHECK (true);
