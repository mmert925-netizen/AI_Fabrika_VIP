/**
 * Vercel deployment'larını toplu siler.
 * Kullanım: node scripts/vercel-clean-deployments.js
 * .env dosyasında VERCEL_TOKEN tanımlı olmalı.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  const p = resolve(process.cwd(), '.env');
  if (!existsSync(p)) return;
  const content = readFileSync(p, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith('VERCEL_TOKEN=')) {
      process.env.VERCEL_TOKEN = line.slice(13).trim();
      break;
    }
  }
}
loadEnv();

const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT = 'ai-fabrika-vip';

if (!TOKEN) {
  console.error('Hata: VERCEL_TOKEN .env dosyasında tanımlı değil.');
  process.exit(1);
}

async function listDeployments() {
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${PROJECT}&limit=100`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  if (!res.ok) throw new Error(`API: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.deployments || [];
}

async function deleteDeployment(id) {
  const res = await fetch(`https://api.vercel.com/v13/deployments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.ok;
}

async function main() {
  let totalDeleted = 0;
  for (;;) {
    console.log(`\n📋 ${PROJECT} deployment'ları listeleniyor...\n`);
    const deployments = await listDeployments();

    if (deployments.length === 0) {
      console.log(totalDeleted ? `\n✅ Toplam ${totalDeleted} deployment silindi.\n` : 'Silinecek deployment yok.\n');
      return;
    }

    console.log(`Toplam ${deployments.length} deployment bulundu.\n`);

    for (const d of deployments) {
      const url = d.url || d.name || d.uid;
      const env = d.target || 'preview';
      process.stdout.write(`  Siliniyor: ${url} (${env})... `);
      const ok = await deleteDeployment(d.uid);
      console.log(ok ? '✓' : '✗');
      if (ok) totalDeleted++;
      await new Promise((r) => setTimeout(r, 300)); // Rate limit
    }
  }
}

main().catch((err) => {
  console.error('Hata:', err.message);
  process.exit(1);
});
