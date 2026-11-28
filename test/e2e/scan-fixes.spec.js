// Tasarım taramasından gelen düzeltmeler (sade): Haftalık Program boş durumu
// araç çubuğu menüsüne binmez, "Ctrl K" ipucu boş arama kutusunda görünür,
// Önşart liste kodları taşmaz, içerik metni >= 12px.
import { test, expect } from '@playwright/test';

const intersects = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test('Haftalık Program: boş durum, açık program menüsündeki düğmelere binmez', async ({ page }) => {
  await page.goto('/#program');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30000 });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sade');
  const empty = page.locator('#view-program p.p-grid-empty');
  await expect(empty).toBeVisible();
  await page.locator('.p-progmenu > summary').click();
  await expect(page.locator('#p-prog-copy')).toBeVisible();
  const e = await empty.boundingBox();
  for (const id of ['#p-prog-rename', '#p-prog-new', '#p-prog-copy', '#p-prog-del']) {
    const b = await page.locator(id).boundingBox();
    expect(intersects(e, b), `${id} boş duruma binmemeli`).toBe(false);
  }
});

test('Başlık arama düğmesi yalnız masaüstünde görünür ve paleti açar', async ({ page, isMobile }) => {
  await page.goto('/#dersler');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30000 });
  const btn = page.locator('.cmdk-trigger');
  if (isMobile) { await expect(btn).toBeHidden(); return; }
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByRole('dialog', { name: 'Komut paleti' })).toBeVisible();
  await expect(page.locator('#view-dersler .cmdk-hint')).toHaveCount(0);
});

test('Önşart: liste kodları sütunlarından taşmaz, mobil seçenek metni >= 12px', async ({ page, isMobile }) => {
  await page.goto('/?prog=CEN_LS#onsart');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30000 });
  await expect(page.locator('.pg-program-select')).toHaveValue('CEN_LS', { timeout: 30000 });
  if (isMobile) {
    const small = page.locator('#pg-root .pg-mobile-course small');
    await expect(small.first()).toBeAttached({ timeout: 20000 });
    const sizes = await small.evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).fontSize)));
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(12);
    return;
  }
  await page.locator('.pg-list-toggle').first().click();
  await expect(page.locator('.pg-li-code').first()).toBeVisible({ timeout: 20000 });
  const over = await page.evaluate(() => [...document.querySelectorAll('.pg-li-code')]
    .filter((c) => c.getBoundingClientRect().right > c.closest('.pg-li').getBoundingClientRect().right + 0.5)
    .map((c) => c.textContent));
  expect(over).toEqual([]);
});
