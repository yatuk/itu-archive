import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

// Canlı yayın duman testi (playwright.live.config.js). Workflow önce
// scripts/wait-for-deploy.mjs ile Cloudflare'in test edilen commit'i sunduğunu
// bekler; EXPECTED_BUILD verilirse test de canlı build.json'u yeniden denetler.

const expectedMissingData = /data\/(?:quota\/.*|exams\/[^/]+)\.json/;
const ONE_YEAR = 31_536_000;

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.stack || String(error)));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const location = message.location().url || '';
    if (expectedMissingData.test(location) || expectedMissingData.test(message.text())) return;
    errors.push(`${location || 'console'}: ${message.text()}`);
  });
  return errors;
}

function maxAge(header) {
  const m = /max-age=(\d+)/.exec(header || '');
  return m ? Number(m[1]) : 0;
}

// Test edilen commit'teki docs/_redirects'ten bir "eski ortak-hoca -> bugünkü
// hoca" kuralı. Veri değiştikçe slug'lar değişebilir; sabit bir adres yerine
// yayınla birlikte gelen kural dosyasından seçilir.
function legacyInstructorRule() {
  const lines = readFileSync('docs/_redirects', 'utf8').split('\n');
  for (const line of lines) {
    const [from, to, code] = line.trim().split(/\s+/);
    if (code === '301' && /^\/hoca\/[^/]+\/$/.test(from || '') && /^\/hoca\/[^/]+\/$/.test(to || '')) {
      return { from, to };
    }
  }
  return null;
}

test('ana uygulama açılır, sekmeler çalışır, veri güncel', async ({ page }, testInfo) => {
  const errors = collectErrors(page);

  const expectedBuild = process.env.EXPECTED_BUILD;
  if (expectedBuild) {
    const stamp = await page.request.get(`/build.json?live-smoke=${Date.now()}`);
    expect(stamp.ok(), 'Canlı build.json okunabilmeli').toBeTruthy();
    expect((await stamp.json()).build, 'Canlı yayın test edilen commit olmalı').toBe(expectedBuild);
  }

  const response = await page.goto(`/?live-smoke=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle(/^İTÜ Ders Programı Oluşturucu ve Ders Arşivi/);
  await expect(page.locator('.brand-title').first()).toBeVisible();
  await expect(page.locator('#view-dersler h1')).toHaveText('Dersler');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30_000 });
  await expect(page.locator('#app-failure')).toBeHidden();

  // Düz şube tablosu: her satır bir şube (her genişlikte).
  await expect(page.locator('#course-groups .cl-body .cl-item').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#stat-term')).not.toHaveText(/^[·.—\s]*$/);

  const status = await page.request.get(`/data/status.json?live-smoke=${Date.now()}`);
  expect(status.ok(), 'Canlı status.json okunabilmeli').toBeTruthy();
  expect(status.headers()['x-robots-tag'], '/data/* noindex olmalı').toContain('noindex');
  const statusData = await status.json();
  expect(statusData.lastRunAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(Number(statusData.sections)).toBeGreaterThan(0);
  const ageHours = (Date.now() - Date.parse(statusData.lastRunAt)) / 3_600_000;
  // Sakin aylarda tarama ayın 1'i ve 15'inde çalışır; en uzun boşluk 15 Aralık → Ocak'ın ilk
  // pazartesisi (~23 gün). 35 gün bu boşluğu ve geciken cron'u karşılar.
  expect(ageHours, 'Son başarılı tarama 35 günden eski olmamalı').toBeLessThan(35 * 24);

  // Sekmeler tembel yüklenir: görünüm modülü ve CSS'i ilk tıklamada gelir.
  for (const view of ['dersplanim', 'onsart', 'sinavlar', 'takvim', 'program']) {
    await page.locator(`#tab-${view}`).click();
    await expect(page.locator(`#tab-${view}`)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`#view-${view}`)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(`#${view}$`));
  }
  await expect(page.locator('#app-failure')).toBeHidden();

  await page.locator('#tab-dersler').click();
  await expect(page.locator('#course-groups .cl-item').first()).toBeVisible();
  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(layout.page, 'Canlı ana görünüm yatay taşmamalı').toBeLessThanOrEqual(layout.viewport + 1);
  await testInfo.attach(`canli-${testInfo.project.name}.png`, {
    body: await page.screenshot({ fullPage: true, animations: 'disabled' }),
    contentType: 'image/png',
  });

  expect(errors, `Canlı konsol hataları:\n${errors.join('\n')}`).toEqual([]);
});

test('güvenlik ve önbellek başlıkları (_headers) yayında', async ({ page, request }) => {
  const home = await request.get(`/?live-smoke=${Date.now()}`);
  expect(home.status()).toBe(200);
  const h = home.headers();
  expect(maxAge(h['strict-transport-security']), 'HSTS en az bir yıl olmalı').toBeGreaterThanOrEqual(ONE_YEAR);
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['cache-control'] || '', 'HTML immutable önbelleklenmemeli').not.toContain('immutable');

  // Sayfanın gerçekten yüklediği sürümlü asset'ler (app.js ve çekirdek CSS).
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const assets = await page.evaluate(() => [
    document.querySelector('script[type="module"][src*="assets/app.js"]')?.getAttribute('src'),
    document.querySelector('link[rel="stylesheet"][href*="assets/css/app.css"]')?.getAttribute('href'),
  ]);
  for (const src of assets) {
    expect(src, 'index.html sürümlü asset bağlantısı taşımalı').toMatch(/assets\/.+\?v=[0-9a-z]+$/);
    const res = await request.get(new URL(src, page.url()).href);
    expect(res.status(), src).toBe(200);
    const cache = res.headers()['cache-control'] || '';
    expect(cache, `${src} immutable olmalı`).toContain('immutable');
    expect(maxAge(cache), `${src} bir yıl önbelleklenmeli`).toBeGreaterThanOrEqual(ONE_YEAR);
  }
});

test('ders ve hoca sayfaları açılır, eski adresler doğru yere 301 verir', async ({ page, request }) => {
  const course = await page.goto('/ders/blg-102e/', { waitUntil: 'domcontentloaded' });
  expect(course.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('BLG 102E');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://itu-ders.com/ders/blg-102e/');

  // Eski İngilizce ders sayfaları kaldırıldı: /en/ders/* -> /ders/:splat.
  const enCourse = await request.get('/en/ders/blg-102e/', { maxRedirects: 0 });
  expect(enCourse.status()).toBe(301);
  expect(new URL(enCourse.headers().location, 'https://itu-ders.com').pathname).toBe('/ders/blg-102e/');

  const rule = legacyInstructorRule();
  expect(rule, 'docs/_redirects içinde eski ortak-hoca kuralı olmalı').not.toBeNull();
  const legacy = await request.get(rule.from, { maxRedirects: 0 });
  expect(legacy.status(), `${rule.from} kalıcı yönlenmeli`).toBe(301);
  expect(new URL(legacy.headers().location, 'https://itu-ders.com').pathname).toBe(rule.to);

  const instructor = await page.goto(rule.to, { waitUntil: 'domcontentloaded' });
  expect(instructor.status(), `${rule.to} açılmalı`).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://itu-ders.com${rule.to}`);
});

test('durum ve kritik arama sayfaları yayın sözleşmesini taşır', async ({ page }) => {
  await page.goto('/status/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('İTÜ Ders Arşivi durumu');
  await expect(page.locator('#status-state')).not.toHaveText('kontrol ediliyor…', { timeout: 20_000 });

  for (const path of ['/ders-arsivi/', '/gano-hesaplama/', '/ders-programi-olustur/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path.replaceAll('/', '\\/')}$`));
    await expect(page.locator('a.lp-cta-top, a.btn-primary, a.btn').first()).toBeVisible();
  }
});
