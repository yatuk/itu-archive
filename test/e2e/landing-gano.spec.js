// /gano-hesaplama/ iniş sayfasındaki satır içi YANO/GANO hesaplayıcısı.
// Sunucu HTML'i örnek dönemle gelir (YANO 3.32); gano-calc.js etkileşimi ekler.

import { test, expect } from '@playwright/test';

async function open(page, path = '/gano-hesaplama/') {
  await page.goto(path);
  // Modül yüklenince form lpg-on sınıfını alır.
  await expect(page.locator('#lpg-form.lpg-on')).toBeAttached();
}

// Satırları silip verilen satırları yazar.
async function fill(page, rows) {
  await page.click('#lpg-clear');
  for (let i = 0; i < rows.length; i++) {
    if (i > 0) await page.click('#lpg-add');
    const tr = page.locator('#lpg-rows tr').nth(i);
    await tr.locator('.lpg-nm').fill(rows[i][0]);
    await tr.locator('.lpg-cr').fill(String(rows[i][1]));
    await tr.locator('.lpg-gr').selectOption(rows[i][2]);
  }
}

test('sunucu HTML örneği ve not tablosu taşır', async ({ page }) => {
  await page.goto('/gano-hesaplama/');
  await expect(page.locator('#lpg-yano')).toHaveText('3.32');
  await expect(page.locator('#lpg-ex')).toBeVisible();
  await expect(page.locator('#lpg-rows tr')).toHaveCount(5);
  await expect(page.locator('.lpg-grades dt')).toHaveCount(15);
  await expect(page.locator('.lpg-grades .lpg-zero dt')).toHaveText(['FF', 'VF']);
  await expect(page.locator('.lpg-link')).toHaveAttribute('href', '/#dersplanim');
});

test('AA 4 kredi + CC 3 kredi = 3.14', async ({ page }) => {
  await open(page);
  await fill(page, [['MAT 101', 4, 'AA'], ['FIZ 101', 3, 'CC']]);
  await expect(page.locator('#lpg-yano')).toHaveText('3.14');
  await expect(page.locator('#lpg-gano')).toHaveText('3.14');
  await expect(page.locator('#lpg-yano-sub')).toContainText('22');
  await expect(page.locator('#lpg-ex')).toBeHidden();
});

test('BA+ seçilebilir ve sonucu değiştirir', async ({ page }) => {
  await open(page);
  await fill(page, [['MAT 101', 4, 'BA']]);
  await expect(page.locator('#lpg-yano')).toHaveText('3.50');
  await page.locator('#lpg-rows .lpg-gr').first().selectOption('BA+');
  await expect(page.locator('#lpg-yano')).toHaveText('3.75');
  await expect(page.locator('#lpg-rows .lpg-gr').first().locator('option')).toHaveCount(15);
});

test('FF kredisiyle paydaya girer', async ({ page }) => {
  await open(page);
  await fill(page, [['A', 4, 'AA'], ['B', 3, 'FF']]);
  await expect(page.locator('#lpg-yano')).toHaveText('2.29');
});

test('satır ekle ve sil', async ({ page }) => {
  await open(page);
  const rows = page.locator('#lpg-rows tr');
  await expect(rows).toHaveCount(5);
  await page.click('#lpg-add');
  await expect(rows).toHaveCount(6);
  await expect(rows.nth(5).locator('.lpg-nm')).toBeFocused();
  await rows.nth(5).locator('.lpg-rm').click();
  await expect(rows).toHaveCount(5);
  // MAT 103E (4 kr BA) silinince: (49.75 - 14) / 11 = 3.25
  await rows.nth(0).locator('.lpg-rm').click();
  await expect(rows).toHaveCount(4);
  await expect(page.locator('#lpg-yano')).toHaveText('3.25');
  // Son satır da silinirse boş bir satır kalır.
  for (let i = 0; i < 4; i++) await rows.first().locator('.lpg-rm').click();
  await expect(rows).toHaveCount(1);
  await expect(page.locator('#lpg-yano')).toHaveText('0.00');
});

test('önceki GANO ve kredi birleştirilir', async ({ page }) => {
  await open(page);
  await fill(page, [['MAT 101', 4, 'AA'], ['FIZ 101', 3, 'CC']]);
  await page.fill('#lpg-prev-g', '3,00');
  await page.fill('#lpg-prev-c', '30');
  await expect(page.locator('#lpg-gano')).toHaveText('3.03');
  await expect(page.locator('#lpg-yano')).toHaveText('3.14');
  await expect(page.locator('#lpg-gano-sub')).toContainText('37');
  await page.fill('#lpg-prev-g', '5');
  await expect(page.locator('#lpg-prev-g')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#lpg-gano')).toHaveText('3.14');
});

test('EN sayfası aynı hesaplayıcıyı taşır', async ({ page }) => {
  await open(page, '/en/gpa-calculator/');
  await expect(page.getByText('Term GPA', { exact: true })).toBeVisible();
  await expect(page.getByText('New CGPA', { exact: true })).toBeVisible();
  await fill(page, [['MAT 101', 4, 'AA'], ['FIZ 101', 3, 'CC']]);
  await expect(page.locator('#lpg-yano')).toHaveText('3.14');
});

for (const theme of ['sade', 'dark']) {
  test(`390 px: yatay taşma yok, girdiler 44 px (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((t) => { try { localStorage.setItem('itu-theme', t); } catch (e) { /* */ } }, theme);
    await open(page);
    await page.click('#lpg-add');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const wrap = await page.locator('.lpg-tbl-wrap').evaluate((e) => e.scrollWidth - e.clientWidth);
    expect(wrap).toBeLessThanOrEqual(0);
    for (const sel of ['.lpg-in', '.lpg-rm', '.lpg-btn', '.lpg-link']) {
      const heights = await page.locator(sel).evaluateAll((els) => els.filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect().height));
      expect(heights.length).toBeGreaterThan(0);
      for (const h of heights) expect(h, sel).toBeGreaterThanOrEqual(44);
    }
  });
}
