/**
 * Tek görsel upload – base64 → Supabase Storage → public URL döner
 * localStorage kotasını aşmamak için galeriye eklemeden önce çağrılır
 */
import { getSupabase, isSupabaseConfigured } from '../utils/supabase.js';

const STORAGE_BUCKET = 'omerai-gallery';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' });

  if (!isSupabaseConfigured()) {
    const missing = [];
    if (!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)) missing.push('SUPABASE_URL');
    if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) missing.push('SUPABASE_SERVICE_ROLE_KEY veya SUPABASE_ANON_KEY');
    return res.status(503).json({
      error: 'Supabase yapılandırılmamış',
      hint: 'Vercel → Settings → Environment Variables. Eksik: ' + (missing.join(', ') || 'bilinmiyor') + '. Preview için de ekleyin.'
    });
  }

  const { image, device_id, serial_no } = req.body || {};
  const dataUrl = typeof image === 'string' ? image : '';
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'image (data URL) gerekli' });
  }

  const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return res.status(400).json({ error: 'Geçersiz base64 format' });

  const [, ext, base64] = match;
  const contentType = `image/${ext === 'jpeg' ? 'jpeg' : ext}`;
  const buffer = Buffer.from(base64, 'base64');
  const deviceId = (device_id || 'anon').toString().slice(0, 64);
  const path = `${deviceId}/${Date.now()}_${serial_no || 0}.${ext === 'jpeg' ? 'jpg' : 'png'}`;

  try {
    const supabase = getSupabase();
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, {
      contentType,
      upsert: true
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return res.status(200).json({ url: data.publicUrl });
  } catch (err) {
    console.error('upload-image error:', err);
    return res.status(500).json({ error: err.message || 'Yükleme hatası' });
  }
}
