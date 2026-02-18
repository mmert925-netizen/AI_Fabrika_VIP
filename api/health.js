/**
 * Vercel Serverless – Fabrika servislerinin sağlık kontrolü
 * Telegram Bot, Imagen/Gemini API, Vercel Server gerçek durum ve latency
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const results = { telegram: null, imagen: null, video: null, vercel: null };
  const startTotal = Date.now();

  // 1. Telegram Bot
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token) {
    const t0 = Date.now();
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const ok = r.ok;
      results.telegram = {
        status: ok ? 'online' : 'error',
        latency: Date.now() - t0,
        message: ok ? 'System Online' : `HTTP ${r.status}`
      };
    } catch (e) {
      results.telegram = { status: 'offline', latency: null, message: e.message || 'Connection failed' };
    }
  } else {
    results.telegram = { status: 'unconfigured', latency: null, message: 'Token not set' };
  }

  // 2. Imagen / Gemini API
  const { getGeminiApiKey } = await import('../utils/gemini-key.js');
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    const t0 = Date.now();
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const ok = r.ok;
      results.imagen = {
        status: ok ? 'online' : 'error',
        latency: Date.now() - t0,
        message: ok ? 'System Online' : `HTTP ${r.status}`
      };
    } catch (e) {
      results.imagen = { status: 'offline', latency: null, message: e.message || 'Connection failed' };
    }
  } else {
    results.imagen = { status: 'unconfigured', latency: null, message: 'API key not set' };
  }

  // 3. Video API (Sora/Runway) – tüm olası isimleri kontrol et
  const soraKey = process.env.SORA_API_KEY || process.env.OPENAI_API_KEY
    || process.env.sora_api_key || process.env.openai_api_key;
  results.video = {
    status: (soraKey && String(soraKey).trim()) ? 'configured' : 'unconfigured',
    message: soraKey ? 'Key mevcut' : 'Key bulunamadı'
  };

  // 4. Vercel Server (bu endpoint'in kendisi = Vercel çalışıyor)
  results.vercel = {
    status: 'online',
    latency: Date.now() - startTotal,
    message: 'System Online'
  };

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    services: results
  });
}
