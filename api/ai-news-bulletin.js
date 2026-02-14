/**
 * Vercel Serverless – Patronun Gündemi: Haftalık AI haber bülteni (sert ve net üslup)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Sadece GET desteklenir' });

  const apiKey = process.env.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY tanımlı değil' });

  try {
    const feeds = [
      'https://techcrunch.com/feed/',
      'https://www.theverge.com/rss/index.xml',
      'https://venturebeat.com/feed/'
    ];
    let allHeadlines = [];

    for (const rssUrl of feeds) {
      try {
        const rssRes = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const xml = await rssRes.text();
        const titleMatches = xml.match(/<title>([^<]+)<\/title>/gi) || [];
        const items = titleMatches.slice(1, 8).map(t => t.replace(/<\/?title>/gi, '').trim()).filter(Boolean);
        allHeadlines = allHeadlines.concat(items);
      } catch (_) {}
    }

    const headlines = [...new Set(allHeadlines)].slice(0, 12);
    if (headlines.length === 0) return res.status(200).json({ summary: 'Haber çekilemedi.', title: 'Patronun Gündemi', headlines: [] });

    const prompt = `"Patronun Gündemi" başlığı altında, bu teknoloji ve yapay zeka haberlerini haftalık bülten formatında özetle. 

Üslup: Sert, net, patron gibi konuş. Kısa cümleler. Lafı dolandırma. Önemli olanı söyle, geç.

Haber başlıkları:
${headlines.join('\n')}

Çıktı: 4-6 cümlelik tek paragraf. "Patron diyor ki:" veya "Bu hafta:" ile başlayabilirsin. Türkçe yaz.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 512 }
    };
    const aiRes = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await aiRes.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || headlines.slice(0, 3).join('. ');

    return res.status(200).json({ summary, title: 'Patronun Gündemi', headlines: headlines.slice(0, 5) });
  } catch (err) {
    console.error('ai-news-bulletin error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası', summary: null, title: 'Patronun Gündemi', headlines: [] });
  }
}
