/**
 * .env'deki Gemini anahtarını test et (Vercel'dan bağımsız)
 * node scripts/test-gemini-key.js
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.error('.env yok');
  process.exit(1);
}

const content = readFileSync(envPath, 'utf8');
let key = '';
for (const line of content.split(/\r?\n/)) {
  const m = line.match(/^(?:GEMINI_API_KEY|Gemini_API_Key)\s*=\s*(.+)$/i);
  if (m) key = m[1].trim();
}
if (!key) {
  console.error('.env\'de GEMINI_API_KEY veya Gemini_API_Key bulunamadı');
  process.exit(1);
}

console.log('Anahtar test ediliyor... (ilk 8 karakter:', key.slice(0, 8) + '...)');
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
const text = await res.text();
if (res.ok) {
  console.log('✓ Anahtar geçerli');
} else {
  console.error('✗ Hata:', text.slice(0, 300));
  process.exit(1);
}
