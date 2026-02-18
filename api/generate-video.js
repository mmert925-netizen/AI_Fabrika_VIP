/**
 * Vercel Serverless – Sora/Runway ile video üretimi
 * SORA_API_KEY veya RUNWAY_API_KEY ortam değişkenlerini eklemelisin
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const { prompt, duration = 15, resolution = '1280x720', provider = 'sora', aspect_ratio = '16:9' } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt gerekli' });
  }

  const cleanPrompt = prompt.trim().slice(0, 1000);
  if (!cleanPrompt) {
    return res.status(400).json({ error: 'Prompt boş olamaz' });
  }

  try {
    let videoUrl = null;
    let mimeType = 'video/mp4';

    // SORA API Entegrasyonu (Örnek)
    if (provider === 'sora') {
      const soraApiKey = process.env.SORA_API_KEY;
      if (!soraApiKey) {
        return res.status(500).json({ error: 'SORA_API_KEY tanımlı değil. Vercel Dashboard > Settings > Environment Variables' });
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
    
    // Runway API Entegrasyonu (Alternatif)
    else if (provider === 'runway') {
      const runwayApiKey = process.env.RUNWAY_API_KEY;
      if (!runwayApiKey) {
        return res.status(500).json({ error: 'RUNWAY_API_KEY tanımlı değil. Vercel Dashboard > Settings > Environment Variables' });
      }

      const runwayResponse = await fetch('https://api.runwayml.com/v1/video_generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${runwayApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text_prompt: cleanPrompt,
          watermarked: false,
          duration: Math.min(duration, 30), // Runway limiti
          ratio: aspect_ratio || '16:9'
        })
      });

      if (!runwayResponse.ok) {
        const err = await runwayResponse.json().catch(() => ({}));
        const msg = err.error?.message || runwayResponse.statusText;
        return res.status(runwayResponse.status).json({ error: `Runway API Hatası: ${msg}` });
      }

      const runwayData = await runwayResponse.json();
      videoUrl = runwayData.output_url;
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
