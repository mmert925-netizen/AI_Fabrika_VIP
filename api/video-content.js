/**
 * Sora video içeriği – OpenAI'dan stream proxy
 * GET /api/video-content?jobId=video_xxx
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const jobId = req.query?.jobId;
  if (!jobId) {
    return res.status(400).json({ error: 'jobId gerekli' });
  }

  const apiKey = (process.env.SORA_API_KEY || process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(503).json({ error: 'API key yok' });
  }

  try {
    const contentRes = await fetch(`https://api.openai.com/v1/videos/${jobId}/content`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    if (!contentRes.ok) {
      const err = await contentRes.text();
      return res.status(contentRes.status).json({ error: err || 'Video alınamadı' });
    }

    const contentType = contentRes.headers.get('content-type') || 'video/mp4';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const buffer = await contentRes.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error('video-content error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
