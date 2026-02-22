/**
 * Vercel Serverless – Gemini ile AI sohbet
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

  const { message, history = [], context = {} } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message gerekli' });
  }

  const userMsg = message.trim().slice(0, 2000);
  if (!userMsg) {
    return res.status(400).json({ error: 'Mesaj boş olamaz' });
  }

  const ctx = `[OTONOM BAĞLAM - Kullanıcı durumu: Galeri ${context.gallery_count ?? '?'} görsel, ${context.tokens ?? '?'} token kredisi, tema ${context.theme || 'dark'}, dil ${context.lang || 'tr'}. Bu bilgiyi kullanarak kişiselleştirilmiş öneriler yap.]`;
  const systemPrompt = `Sen ÖMER.AI Fabrika'nın asistanısın. Yazılım ve yapay zeka fabrikası - "Geleceği kodla, görselleri mühürle" mottosuyla çalışıyoruz.
${ctx}

HİZMETLER:
- Yapay Zeka Modelleme: Gemini ve Imagen 4.0 tabanlı botlar, otonom sistemler
- Siberpunk Web Tasarım: modern, hızlı siteler, HTML/CSS şablonlar
- Yazılım Otomasyonu: Telegram entegrasyonu, iş akışı otomasyonu

FİYATLAR (Piyasa karşılaştırması):
- Özel AI Bot: 35.000₺+ (VIP Mühür)
- Siberpunk Web Arayüzü: 25.000₺+ (Jilet Tasarım)
- Görsel Üretim: Kredi/Mühür sistemi (abonelik)
- Teknik Destek: Sistem izleme, otonom destek

PAKETLER: Standart (temel destek), Pro (AI Lab + destek), V49 VIP (özel imalat hattı, tam otonom AI fabrikasyon).

PROJELER (Sergi): Neon Şehir, Robot Portresi, Sanal Evren, Mekanik Bulutlar, Holografik İkon, Dijital Orman. VIP hattında 6 proje daha.

BOT YETENEKLERİ (otomatik tetiklenir):
- Görsel üret: "çiz", "görsel", "resim", "üret" → AI Lab görsel üretir
- Web şablon: "web tasarımı yap X" → HTML/CSS şablon üretilir
- Post: "post yaz" → sosyal medya postu
- Haber: "haber özeti" → güncel haber özeti

SEN NE YAPARSIN:
- Fiyat tahmini ver (proje tipine göre: web, AI bot, görsel paketi vb.)
- Tahmini süre söyle (web 1-2 hafta, AI bot 2-3 hafta)
- Proje önerisi yap (ihtiyaca göre)
- SSS: Destek 1 ay ücretsiz. Ödeme Havale/EFT, %50 ön ödeme.
- Samimi, yardımcı, kısa ama yeterli yanıtlar. Türkçe veya kullanıcının dilinde.
- Emoji kullanabilirsin (orta düzey).
- Bilmediğin konuda "İletişim formundan detaylı teklif alabilirsin" de.
- OTONOM: Bağlam bilgisini kullan. Galeri boşsa görsel üretmeyi öner. Token varsa HD modu hatırlat. Kişiselleştirilmiş öneriler ver.`;

  try {
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const fullPrompt = history.length > 0
      ? [...history.map(h => `${h.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${h.text}`), `Kullanıcı: ${userMsg}`].join('\n\n')
      : `${systemPrompt}\n\nKullanıcı: ${userMsg}`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 1024,
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
