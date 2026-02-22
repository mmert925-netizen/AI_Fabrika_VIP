/**
 * Vercel Serverless – Gemini ile görsel üretimi
 * Ortam değişkeni: GEMINI_API_KEY | GOOGLE_AI_API_KEY | GOOGLE_GENERATIVE_AI_API_KEY
 */
import { getGeminiApiKey } from '../utils/gemini-key.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API anahtarı tanımlı değil. Vercel > Environment Variables' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt gerekli' });
  }

  let cleanPrompt = prompt.trim().slice(0, 1000);
  if (!cleanPrompt) {
    return res.status(400).json({ error: 'Prompt boş olamaz' });
  }

  const VARIANCE = [
    'golden hour lighting', 'dramatic shadows', 'soft diffused light', 'cinematic composition',
    'low angle view', 'bird eye perspective', 'close-up detail', 'wide establishing shot',
    'warm color palette', 'cool blue tones', 'high contrast', 'muted pastel colors',
    'atmospheric depth', 'bokeh background', 'sharp focus', 'dreamy soft focus',
    'unique composition', 'unexpected angle', 'artistic interpretation', 'creative variation'
  ];
  const r1 = VARIANCE[Math.floor(Math.random() * VARIANCE.length)];
  let r2 = VARIANCE[Math.floor(Math.random() * VARIANCE.length)];
  while (r2 === r1) r2 = VARIANCE[Math.floor(Math.random() * VARIANCE.length)];
  cleanPrompt = `${cleanPrompt}, ${r1}, ${r2}`;

  const models = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const body = {
        contents: [{ parts: [{ text: cleanPrompt }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 0.95,
          topP: 0.95,
          topK: 40
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        lastError = data.error?.message || data.error || response.statusText;
        console.warn(`generate-image ${model} failed:`, lastError);
        continue;
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      let imageBase64 = null;

      for (const part of parts) {
        const inline = part.inlineData || part.inline_data;
        if (inline?.data) {
          imageBase64 = inline.data;
          break;
        }
      }

      if (imageBase64) {
        console.log('Görsel URL alındı: [base64 - Gemini]', model);
        return res.status(200).json({ image: imageBase64, mimeType: 'image/png' });
      }

      lastError = 'Model görsel döndürmedi';
    } catch (err) {
      lastError = err.message;
      console.warn(`generate-image ${model} error:`, err.message);
    }
  }

  console.error('generate-image tüm modeller başarısız:', lastError);
  return res.status(500).json({
    error: lastError ? `Görsel üretilemedi: ${lastError}` : 'Görsel üretilemedi. Vercel → Logs kontrol et.'
  });
}
