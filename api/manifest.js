/**
 * manifest.json API – Deployment Protection bypass
 * Tarayıcı /manifest.json yerine /api/manifest kullanırsa,
 * aynı domain'den fetch yapıldığı için auth cookie ile birlikte gider.
 * Alternatif: Vercel Dashboard'da Deployment Protection'ı kapat.
 */
const manifest = {
  name: "ÖMER.AI | Yapay Zeka Fabrikası",
  short_name: "ÖMER.AI",
  description: "Yazılım ve yapay zeka fabrikası. Geleceği kodla, görselleri mühürle.",
  start_url: "/",
  display: "standalone",
  background_color: "#1e3a4f",
  theme_color: "#22d3ee",
  orientation: "portrait-primary",
  icons: [
    { src: "/img/proje1.jpg", sizes: "192x192", type: "image/jpeg", purpose: "any" },
    { src: "/img/proje1.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any" }
  ]
};

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json(manifest);
}
