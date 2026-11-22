#!/usr/bin/env node
// Canlı sitenin beklenen yayın damgasını (build.json) sunmasını bekler.
//
//   node scripts/wait-for-deploy.mjs                       # docs/build.json'daki damgayı bekle
//   node scripts/wait-for-deploy.mjs --expected <damga>    # belirli bir damgayı bekle
//   node scripts/wait-for-deploy.mjs --print               # yalnız canlı damgayı yaz
//
// Ortam: LIVE_BASE_URL (varsayılan https://itu-ders.com), DEPLOY_WAIT_SECONDS
// (varsayılan 600), DEPLOY_POLL_SECONDS (varsayılan 15).
//
// Çıkış kodları: 0 yayın görüldü, 2 süre doldu ("deploy not seen"), 1 kullanım
// ya da yerel dosya hatası. Süre dolması test hatası değildir: Cloudflare
// Pages o commit'i henüz (ya da hiç) yayına almamıştır.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const base = (process.env.LIVE_BASE_URL || 'https://itu-ders.com').replace(/\/+$/, '');
const timeoutSec = Number(process.env.DEPLOY_WAIT_SECONDS || 600);
const pollSec = Number(process.env.DEPLOY_POLL_SECONDS || 15);

async function liveStamp() {
  const res = await fetch(`${base}/build.json?deploy-check=${Date.now()}`, {
    headers: { 'cache-control': 'no-cache' },
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (typeof body.build !== 'string' || !body.build) throw new Error('build alanı yok');
  return body.build;
}

if (args.includes('--print')) {
  console.log(await liveStamp());
  process.exit(0);
}

let expected = flag('--expected');
if (!expected) {
  try {
    expected = JSON.parse(readFileSync(flag('--file') || 'docs/build.json', 'utf8')).build;
  } catch (err) {
    console.error(`::error title=build.json okunamadı::${err.message} — 'go run ./cmd/site' çalıştırıldı mı?`);
    process.exit(1);
  }
}
if (!expected) {
  console.error('::error title=build.json okunamadı::build alanı boş');
  process.exit(1);
}

const deadline = Date.now() + timeoutSec * 1000;
let last = '';
for (let attempt = 1; ; attempt++) {
  try {
    last = await liveStamp();
  } catch (err) {
    last = `okunamadı (${err.message})`;
  }
  if (last === expected) {
    console.log(`Yayın hazır: ${base} build=${expected} (${attempt}. deneme)`);
    process.exit(0);
  }
  console.log(`${attempt}. deneme: canlı build=${last}, beklenen=${expected}`);
  if (Date.now() + pollSec * 1000 > deadline) break;
  await new Promise((r) => setTimeout(r, pollSec * 1000));
}
console.error(
  `::error title=deploy not seen::${base} ${timeoutSec} sn içinde beklenen yayını sunmadı ` +
  `(beklenen build=${expected}, son görülen=${last}). Bu bir test hatası değil: ` +
  `Cloudflare Pages bu commit'i henüz yayına almadı ya da derleme başarısız oldu (commit'teki "Cloudflare Pages" kontrolüne bak).`,
);
process.exit(2);
