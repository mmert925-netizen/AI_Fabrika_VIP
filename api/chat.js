/**
 * Vercel Serverless – Gemini ile AI sohbet
 * GEMINI_API_KEY Vercel Environment Variables'da tanımlı olmalı
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const apiKey = process.env.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY tanımlı değil. Vercel > Environment Variables' });
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message gerekli' });
  }

  const userMsg = message.trim().slice(0, 2000);
  if (!userMsg) {
    return res.status(400).json({ error: 'Mesaj boş olamaz' });
  }

  const systemPrompt = `Sen ÖMER.AI Fabrika'nın asistanısın. Yazılım ve yapay zeka hizmetleri sunuyoruz: Gemini ve Imagen 4.0 ile görsel üretimi, chatbot, web tasarım, Telegram entegrasyonu. Kısa, samimi ve yardımcı yanıtlar ver. Türkçe veya kullanıcının dilinde cevap ver.`;

  try {
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const fullPrompt = history.length > 0
      ? [...history.map(h => `${h.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${h.text}`), `Kullanıcı: ${userMsg}`].join('\n\n')
      : `${systemPrompt}\n\nKullanıcı: ${userMsg}`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      }
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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Bir yanıt üretilemedi.';

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error('chat error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
