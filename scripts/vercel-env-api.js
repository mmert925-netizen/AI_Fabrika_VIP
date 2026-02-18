/**
 * .env değerlerini Vercel REST API ile ekler (CLI link gerekmez).
 * Kullanım: node scripts/vercel-env-api.js
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.error('.env bulunamadı');
  process.exit(1);
}

const content = readFileSync(envPath, 'utf8');
const vars = {};
for (const line of content.split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
if (vars.Gemini_API_Key && !vars.GEMINI_API_KEY) vars.GEMINI_API_KEY = vars.Gemini_API_Key;
if (vars.RUNWAYML_API_SECRET && !vars.RUNWAY_API_KEY) vars.RUNWAY_API_KEY = vars.RUNWAYML_API_SECRET;

const token = vars.VERCEL_TOKEN?.trim();
if (!token) {
  console.error('.env içinde VERCEL_TOKEN gerekli');
  process.exit(1);
}

const PROJECT = 'ai-fabrika-vip';
const TEAM_SLUG = 'omers-projects-117ad19a';
const toAdd = ['GEMINI_API_KEY', 'OPENAI_API_KEY', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'REPLICATE_API_TOKEN', 'RUNWAY_API_KEY'];

const items = toAdd.filter((name) => vars[name]);
if (!vars.RUNWAY_API_KEY && Object.keys(vars).some(k => /runway/i.test(k))) {
  console.warn('Uyarı: RUNWAY_API_KEY bulunamadı. .env\'de tam olarak RUNWAY_API_KEY=key_xxx yazın (boşluk yok).');
}
if (items.length === 0) {
  console.error('Eklenecek env yok. .env\'de GEMINI_API_KEY, OPENAI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID olmalı.');
  process.exit(1);
}

const url = `https://api.vercel.com/v10/projects/${PROJECT}/env?slug=${TEAM_SLUG}&upsert=true`;
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const added = [];

for (const name of items) {
  const body = {
    key: name,
    value: String(vars[name]).trim(),
    type: 'encrypted',
    target: ['production', 'preview', 'development']
  };
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (res.ok) {
    added.push(name);
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ ${name}:`, res.status, await res.text());
  }
}
console.log(`\n${added.length}/${items.length} eklendi/güncellendi`);
console.log('\nSonra: npx vercel --prod --scope', TEAM_SLUG);
