/**
 * Vercel Serverless – Gemini ile görsel üretimi
 * Vercel'de GEMINI_API_KEY ortam değişkenini eklemelisin
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const apiKey = process.env.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'gemini_api_key tanımlı değil. Vercel Dashboard > Settings > Environment Variables' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt gerekli' });
  }

  const cleanPrompt = prompt.trim().slice(0, 1000);
  if (!cleanPrompt) {
    return res.status(400).json({ error: 'Prompt boş olamaz' });
  }

  try {
    const model = 'gemini-2.5-flash-preview-05-20';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: cleanPrompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || response.statusText;
      return res.status(response.status).json({ error: msg });
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    let imageBase64 = null;

    for (const part of parts) {
      const inline = part.inlineData || part.inline_data;
      if (inline?.data) {
        imageBase64 = inline.data;
        break;
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: 'Görsel üretilemedi. Model görsel üretimini desteklemiyor olabilir.' });
    }

    return res.status(200).json({ image: imageBase64, mimeType: 'image/png' });
  } catch (err) {
    console.error('generate-image error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
