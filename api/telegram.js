/**
 * Vercel Serverless – İletişim formu mesajlarını Telegram'a gönderir
 * Token ve Chat ID güvenli şekilde backend'de tutulur (env değişkenleri)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram yapılandırması eksik. Vercel Environment Variables kontrol edin.' });
  }

  const { name, email, message } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Ad alanı boş olamaz.' });
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'E-posta alanı boş olamaz.' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Mesaj alanı boş olamaz.' });
  }

  const cleanName = name.trim().slice(0, 200);
  const cleanEmail = email.trim().slice(0, 200);
  const cleanMessage = message.trim().slice(0, 2000);

  const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${cleanName}\n📧 *E-posta:* ${cleanEmail}\n📝 *Mesaj:* ${cleanMessage}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.description || 'Telegram API hatası' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Sunucu hatası' });
  }
}
