import { test, expect } from '@playwright/test';

test('yayın aynı asset sürümüyle açılır ve temel görünümler çalışır', async ({ page }, testInfo) => {
  const errors = [];
  const expectedMissingData = /data\/(?:quota\/.*|exams\/[^/]+)\.json/;
  // stats.itu-ders.com: masthead ziyaret sayacının Worker'ı (cloudflare/stats-worker/)
  // henüz deploy edilmedi; DNS çözülemiyor. Worker canlıya alınınca bu satır kaldırılmalı.
  const expectedStatsWorkerDown = /stats\.itu-ders\.com/;
  page.on('pageerror', (error) => errors.push(error.stack || String(error)));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const location = message.location().url || '';
    if (expectedMissingData.test(location) || expectedMissingData.test(message.text())) return;
    if (expectedStatsWorkerDown.test(location) || expectedStatsWorkerDown.test(message.text())) return;
    errors.push(`${location || 'console'}: ${message.text()}`);
  });

  await page.goto(`/?live-smoke=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30_000 });
  await expect(page.locator('#app-failure')).toBeHidden();

  const expectedRelease = process.env.EXPECTED_ASSET_VERSION;
  if (expectedRelease) {
    await expect(page.locator('script[type="module"][src*="assets/app.js"]')).toHaveAttribute('src', new RegExp(`app\\.js\\?v=${expectedRelease}$`));
  }

  const firstResult = page.viewportSize().width <= 640
    ? page.locator('#course-groups .mobile-course-group').first()
    : page.locator('#results tbody tr').first();
  await expect(firstResult).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#stat-term')).not.toHaveText(/^[·.—\s]*$/);

  const status = await page.request.get(`/data/status.json?live-smoke=${Date.now()}`);
  expect(status.ok(), 'Canlı status.json okunabilmeli').toBeTruthy();
  const statusData = await status.json();
  expect(statusData.lastRunAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(Number(statusData.sections)).toBeGreaterThan(0);
  const ageHours = (Date.now() - Date.parse(statusData.lastRunAt)) / 3_600_000;
  expect(ageHours, 'Son başarılı tarama 48 saatten eski olmamalı').toBeLessThan(48);

  for (const view of ['dersplanim', 'onsart', 'sinavlar', 'takvim', 'program']) {
    await page.locator(`#tab-${view}`).click();
    await expect(page.locator(`#view-${view}`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#${view}$`));
  }

  await page.locator('#tab-dersler').click();
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

test('durum ve kritik arama sayfaları yayın sözleşmesini taşır', async ({ page }) => {
  await page.goto('/status/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('İTÜ Ders Arşivi durumu');
  await expect(page.locator('#status-state')).not.toHaveText('kontrol ediliyor…', { timeout: 20_000 });

  for (const path of ['/ders-arsivi/', '/gano-hesaplama/', '/ders-programi-olustur/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path.replaceAll('/', '\\/')}$`));
    await expect(page.locator('a.btn-primary, a.btn').first()).toBeVisible();
  }
});
