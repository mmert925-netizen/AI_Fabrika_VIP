/**
 * .env dosyasındaki değerleri Vercel'e ekler.
 * Kullanım: node scripts/vercel-env-push.js
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

const envPath = resolve(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.error('.env bulunamadı');
  process.exit(1);
}

const content = readFileSync(envPath, 'utf8');
const vars = {};
for (const line of content.split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m) vars[m[1]] = m[2].trim();
}
// Gemini_API_Key -> GEMINI_API_KEY alias
if (vars.Gemini_API_Key && !vars.GEMINI_API_KEY) vars.GEMINI_API_KEY = vars.Gemini_API_Key;

const toAdd = ['GEMINI_API_KEY', 'OPENAI_API_KEY', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'REPLICATE_API_TOKEN', 'RUNWAY_API_KEY'];
let added = 0;

for (const name of toAdd) {
  const val = vars[name];
  if (!val) continue;
  const input = val + '\nn\n';
  const r = spawnSync('npx', ['vercel', 'env', 'add', name, 'production'], {
    input,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true
  });
  if (r.status === 0) {
    console.log(`✓ ${name}`);
    added++;
  } else {
    console.log(`✗ ${name}`);
  }
}

console.log(`\n${added}/${toAdd.length} eklendi. Sonra: vercel --prod`);
