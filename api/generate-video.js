/**
 * Vercel Serverless – Replicate / Sora / Runway ile video üretimi
 * Replicate: REPLICATE_API_TOKEN (ücretsiz deneme)
 * Sora: SORA_API_KEY veya OPENAI_API_KEY
 * Runway: RUNWAY_API_KEY veya RUNWAYML_API_SECRET
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const { prompt, duration = 15, resolution = '1280x720', provider = 'replicate', aspect_ratio = '16:9' } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt gerekli' });
  }

  const cleanPrompt = prompt.trim().slice(0, 1000);
  if (!cleanPrompt) {
    return res.status(400).json({ error: 'Prompt boş olamaz' });
  }

  try {
    let videoUrl = null;
    let jobId = null;
    let mimeType = 'video/mp4';

    // Replicate API – Minimax video-01 (ücretsiz deneme)
    if (provider === 'replicate') {
      let token = (process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY || '').trim();
      token = token.replace(/^["']|["']$/g, ''); // Tırnak kopyalama hatası
      if (!token) {
        return res.status(503).json({
          error: 'Replicate API yapılandırılmamış.',
          hint: 'Vercel: Settings > Environment Variables > REPLICATE_API_TOKEN ekleyin. replicate.com hesabından ücretsiz token alabilirsiniz.',
          code: 'API_KEY_MISSING'
        });
      }
      // Replicate token: r8_ ile başlar, ~40 karakter
      const tokenValidFormat = token.startsWith('r8_') && token.length >= 35 && token.length <= 50;
      const repRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: '5aa835260ff7f40f4069c41185f72036accf99e29957bb4a3b3a911f3b6c1912',
          input: { prompt: cleanPrompt, prompt_optimizer: true }
        })
      });
      if (!repRes.ok) {
        const err = await repRes.json().catch(() => ({}));
        const msg = err.detail || err.error || repRes.statusText;
        const isQuota = /free time limit|quota|billing/i.test(String(msg));
        const isAuth = repRes.status === 401 || /invalid.*token|authentication|valid.*token/i.test(String(msg));
        let hint;
        if (isQuota) {
          hint = 'Ücretsiz kota doldu. Devam için replicate.com/account/billing adresinden ödeme ekleyin.';
        } else if (isAuth) {
          const diag = `[Token var: ${!!token}, uzunluk: ${token.length}, format: ${tokenValidFormat ? 'OK' : 'HATALI'}]`;
          if (!tokenValidFormat) {
            hint = `Token formatı hatalı. ${diag} replicate.com/account/api-tokens → Yeni token.`;
          } else {
            hint = `Token Replicate tarafından reddedildi (iptal/yanlış olabilir). ${diag}`;
          }
        } else {
          hint = `Replicate API Hatası: ${msg}`;
        }
        return res.status(repRes.status).json({ error: hint, code: isQuota ? 'QUOTA_EXCEEDED' : undefined });
      }
      const repData = await repRes.json();
      jobId = repData.id;
      if (!jobId) {
        return res.status(500).json({ error: 'Replicate job oluşturulamadı.' });
      }
      return res.status(200).json({
        jobId,
        status: 'processing',
        provider: 'replicate',
        prompt: cleanPrompt,
        duration,
        resolution
      });
    }

    // SORA API – tüm olası env var isimlerini dene
    if (provider === 'sora') {
      const soraApiKey = process.env.SORA_API_KEY
        || process.env.OPENAI_API_KEY
        || process.env.sora_api_key
        || process.env.openai_api_key
        || process.env.Sora_Api_Key;
      if (!soraApiKey || !String(soraApiKey).trim()) {
        return res.status(503).json({
          error: 'Video API yapılandırılmamış.',
          hint: 'Vercel: Settings > Environment Variables > SORA_API_KEY veya OPENAI_API_KEY ekleyin, ardından Redeploy yapın.',
          code: 'API_KEY_MISSING'
        });
      }

      const soraResponse = await fetch('https://api.sora.com/v1/videos/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${soraApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: cleanPrompt,
          duration_seconds: Math.min(duration, 60), // Sora limiti
          resolution: resolution,
          aspect_ratio: '16:9',
          quality: 'high'
        })
      });

      if (!soraResponse.ok) {
        const err = await soraResponse.json().catch(() => ({}));
        const msg = err.error?.message || soraResponse.statusText;
        return res.status(soraResponse.status).json({ error: `Sora API Hatası: ${msg}` });
      }

      const soraData = await soraResponse.json();
      videoUrl = soraData.video_url;
    }
    
    // Runway API – text_to_video (api.dev.runwayml.com, v2024-11-06)
    else if (provider === 'runway') {
      const runwayApiKey = (process.env.RUNWAY_API_KEY || process.env.RUNWAYML_API_SECRET || '').trim();
      const keyValidFormat = runwayApiKey.startsWith('key_') && /^key_[0-9a-f]{128}$/i.test(runwayApiKey);
      if (!runwayApiKey) {
        return res.status(503).json({
          error: 'Runway API yapılandırılmamış.',
          hint: 'Vercel: RUNWAY_API_KEY ekleyin. Anahtar: dev.runwayml.com → API Keys. Redeploy gerekli.',
          code: 'API_KEY_MISSING'
        });
      }

      const ratioMap = { '16:9': '1280:720', '9:16': '720:1280' };
      const runwayRatio = ratioMap[aspect_ratio] || '1280:720';
      const runwayDuration = Math.min(Math.max(2, Math.round(duration)), 10);

      const runwayResponse = await fetch('https://api.dev.runwayml.com/v1/text_to_video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${runwayApiKey}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-11-06'
        },
        body: JSON.stringify({
          model: 'veo3.1_fast',
          promptText: cleanPrompt,
          ratio: runwayRatio,
          duration: runwayDuration
        })
      });

      if (!runwayResponse.ok) {
        const err = await runwayResponse.json().catch(() => ({}));
        const msg = err.message || err.error || runwayResponse.statusText;
        const isAuth = runwayResponse.status === 401 || /unauthorized|invalid.*key/i.test(String(msg));
        let hint;
        if (isAuth) {
          const diag = `[Key var: ${!!runwayApiKey}, uzunluk: ${runwayApiKey.length}, format: ${keyValidFormat ? 'OK' : 'HATALI'}]`;
          if (!keyValidFormat) {
            hint = `Anahtar formatı hatalı. ${diag} key_ + 128 hex karakter olmalı.`;
          } else {
            hint = `Runway anahtarı reddedildi. ${diag} dev.runwayml.com → API Keys, Billing kontrol et.`;
          }
        } else {
          hint = `Runway API Hatası: ${msg}`;
        }
        return res.status(runwayResponse.status).json({ error: hint });
      }

      const runwayData = await runwayResponse.json();
      jobId = runwayData.id;
      if (!jobId) return res.status(500).json({ error: 'Runway task oluşturulamadı.' });
      return res.status(200).json({
        jobId,
        status: 'processing',
        provider: 'runway',
        prompt: cleanPrompt,
        duration: runwayDuration,
        resolution
      });
    }

    if (!videoUrl) {
      return res.status(500).json({ error: 'Video üretilemedi. API yanıtı boş.' });
    }

    return res.status(200).json({ 
      videoUrl: videoUrl, 
      mimeType: mimeType,
      provider: provider,
      prompt: cleanPrompt,
      duration: duration,
      resolution: resolution
    });

  } catch (err) {
    console.error('generate-video error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
