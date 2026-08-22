import { test, expect } from '@playwright/test';

test('yayın aynı asset sürümüyle açılır ve temel görünümler çalışır', async ({ page }) => {
  const errors = [];
  const expectedMissingData = /data\/(?:quota\/.*|exams\/[^/]+)\.json/;
  page.on('pageerror', (error) => errors.push(error.stack || String(error)));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const location = message.location().url || '';
    if (expectedMissingData.test(location) || expectedMissingData.test(message.text())) return;
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

  for (const view of ['dersplanim', 'onsart', 'sinavlar', 'takvim', 'program']) {
    await page.locator(`#tab-${view}`).click();
    await expect(page.locator(`#view-${view}`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#${view}$`));
  }

  expect(errors, `Canlı konsol hataları:\n${errors.join('\n')}`).toEqual([]);
});
