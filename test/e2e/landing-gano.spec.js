// /gano-hesaplama/ iniş sayfasındaki satır içi YANO/GANO hesaplayıcısı.
// Sunucu HTML'i örnek dönemle gelir (YANO 3.32); gano-calc.js etkileşimi ekler.
// Harf notu, renk rampalı hap dizisidir (role="radiogroup", core/grade-picker.js).

import { test, expect } from '@playwright/test';

async function open(page, path = '/gano-hesaplama/') {
  await page.goto(path);
  // Modül yüklenince form lpg-on sınıfını alır.
  await expect(page.locator('#lpg-form.lpg-on')).toBeAttached();
}

const pill = (row, grade) => row.locator(`.lpg-gp [role="radio"][data-grade="${grade}"]`);

// Satırları silip verilen satırları yazar.
async function fill(page, rows) {
  await page.click('#lpg-clear');
  for (let i = 0; i < rows.length; i++) {
    if (i > 0) await page.click('#lpg-add');
    const row = page.locator('#lpg-rows .lpg-row').nth(i);
    await row.locator('.lpg-nm').fill(rows[i][0]);
    await row.locator('.lpg-cr').fill(String(rows[i][1]));
    await pill(row, rows[i][2]).click();
  }
}

test('sunucu HTML örneği ve not tablosu taşır', async ({ page }) => {
  await page.goto('/gano-hesaplama/');
  await expect(page.locator('#lpg-yano')).toHaveText('3.32');
  await expect(page.locator('#lpg-gano')).toHaveText('3.32');
  await expect(page.locator('#lpg-tcr')).toHaveText('15');
  await expect(page.locator('#lpg-ex')).toBeVisible();
  await expect(page.locator('#lpg-rows .lpg-row')).toHaveCount(5);
  await expect(page.locator('#lpg-rows .lpg-gp[role="radiogroup"]')).toHaveCount(5);
  await expect(page.locator('#lpg-rows [role="radio"][aria-checked="true"]')).toHaveText(['BA', 'BB+', 'CB', 'AA', 'BA']);
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
  await expect(page.locator('#lpg-tcr')).toHaveText('7');
  await expect(page.locator('#lpg-ex')).toBeHidden();
});

test('harf hapı seçilince büyük GANO canlı güncellenir', async ({ page }) => {
  await open(page);
  await fill(page, [['MAT 101', 4, 'BA']]);
  await expect(page.locator('#lpg-gano')).toHaveText('3.50');
  const row = page.locator('#lpg-rows .lpg-row').first();
  await pill(row, 'BA+').click();
  await expect(page.locator('#lpg-gano')).toHaveText('3.75');
  await expect(page.locator('#lpg-yano')).toHaveText('3.75');
  await expect(pill(row, 'BA+')).toHaveAttribute('aria-checked', 'true');
  await expect(pill(row, 'BA')).toHaveAttribute('aria-checked', 'false');
  await expect(row.locator('.lpg-gp [role="radio"]')).toHaveCount(15);
  await expect(row.locator('.lpg-gp [role="radio"][aria-checked="true"]')).toHaveCount(1);
  // Seçili hap katsayı rengiyle dolar (seçili olmayandan farklı zemin).
  const bg = (g) => pill(row, g).evaluate((e) => getComputedStyle(e).backgroundColor);
  expect(await bg('BA+')).not.toBe(await bg('AA'));
});

test('not seçici klavyeyle çalışır: oklar gezer, Enter/Space seçer', async ({ page }) => {
  await open(page);
  await fill(page, [['MAT 101', 4, 'AA']]);
  const row = page.locator('#lpg-rows .lpg-row').first();
  const group = row.locator('.lpg-gp');
  await expect(group).toHaveAttribute('role', 'radiogroup');
  // Grupta tek Tab durağı: seçili hap.
  await expect(group.locator('[tabindex="0"]')).toHaveText('AA');
  await pill(row, 'AA').focus();
  await page.keyboard.press('ArrowRight');
  await expect(pill(row, 'BA+')).toBeFocused();
  // Ok yalnızca odağı taşır; seçim Enter ile.
  await expect(page.locator('#lpg-gano')).toHaveText('4.00');
  await page.keyboard.press('Enter');
  await expect(pill(row, 'BA+')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#lpg-gano')).toHaveText('3.75');
  await page.keyboard.press('End');
  await expect(pill(row, 'VF')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(pill(row, 'FF')).toBeFocused();
  await page.keyboard.press(' ');
  await expect(pill(row, 'FF')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#lpg-gano')).toHaveText('0.00');
  // Odak halkası görünür.
  const outline = await pill(row, 'FF').evaluate((e) => getComputedStyle(e).outlineStyle);
  expect(outline).not.toBe('none');
});

test('kredi adımlayıcı krediyi artırır ve azaltır', async ({ page }) => {
  await open(page);
  await fill(page, [['MAT 101', 3, 'AA'], ['FIZ 101', 3, 'CC']]);
  const row = page.locator('#lpg-rows .lpg-row').first();
  await expect(page.locator('#lpg-yano')).toHaveText('3.00');
  await row.locator('.lpg-sb[data-d="1"]').click();
  await expect(row.locator('.lpg-cr')).toHaveValue('4');
  await expect(page.locator('#lpg-yano')).toHaveText('3.14');
  await row.locator('.lpg-sb[data-d="-1"]').click();
  await row.locator('.lpg-sb[data-d="-1"]').click();
  await expect(row.locator('.lpg-cr')).toHaveValue('2');
  await expect(page.locator('#lpg-tcr')).toHaveText('5');
});

test('FF kredisiyle paydaya girer', async ({ page }) => {
  await open(page);
  await fill(page, [['A', 4, 'AA'], ['B', 3, 'FF']]);
  await expect(page.locator('#lpg-yano')).toHaveText('2.29');
});

test('satır ekle ve sil', async ({ page }) => {
  await open(page);
  const rows = page.locator('#lpg-rows .lpg-row');
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

test('önceki GANO ve kredi birleştirilir, fark satırı yön gösterir', async ({ page }) => {
  await open(page);
  await expect(page.locator('#lpg-delta')).toBeHidden();
  await fill(page, [['MAT 101', 4, 'AA'], ['FIZ 101', 3, 'CC']]);
  await page.fill('#lpg-prev-g', '3,00');
  await page.fill('#lpg-prev-c', '30');
  await expect(page.locator('#lpg-gano')).toHaveText('3.03');
  await expect(page.locator('#lpg-yano')).toHaveText('3.14');
  await expect(page.locator('#lpg-gano-sub')).toContainText('37');
  await expect(page.locator('#lpg-allcr')).toHaveText('37');
  await expect(page.locator('#lpg-delta')).toBeVisible();
  await expect(page.locator('#lpg-delta')).toContainText('+0.03 şu ana göre');
  await expect(page.locator('#lpg-delta')).toHaveClass(/lpg-up/);
  // Düşük not GANO'yu düşürür: (90 + 0 + 6) / 37 = 2.59, fark eksi.
  await pill(page.locator('#lpg-rows .lpg-row').first(), 'FF').click();
  await expect(page.locator('#lpg-gano')).toHaveText('2.59');
  await expect(page.locator('#lpg-delta')).toContainText('−0.41');
  await expect(page.locator('#lpg-delta')).toHaveClass(/lpg-down/);
  await page.fill('#lpg-prev-g', '5');
  await expect(page.locator('#lpg-prev-g')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#lpg-delta')).toBeHidden();
  await expect(page.locator('#lpg-gano')).toHaveText('0.86');
});

test('EN sayfası aynı hesaplayıcıyı taşır', async ({ page }) => {
  await open(page, '/en/gpa-calculator/');
  await expect(page.getByText('Term GPA', { exact: true })).toBeVisible();
  await expect(page.getByText('New CGPA', { exact: true })).toBeVisible();
  await fill(page, [['MAT 101', 4, 'AA'], ['FIZ 101', 3, 'CC']]);
  await expect(page.locator('#lpg-yano')).toHaveText('3.14');
  await page.fill('#lpg-prev-g', '3');
  await page.fill('#lpg-prev-c', '30');
  await expect(page.locator('#lpg-delta')).toContainText('vs current');
});

for (const theme of ['sade', 'dark']) {
  for (const width of [375, 390]) {
    test(`${width} px: yatay taşma yok, dokunma hedefleri 44 px (${theme})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript((t) => { try { localStorage.setItem('itu-theme', t); } catch (e) { /* */ } }, theme);
      await open(page);
      await page.click('#lpg-add');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const wrap = await page.locator('#lpg-rows').evaluate((e) => e.scrollWidth - e.clientWidth);
      expect(wrap).toBeLessThanOrEqual(0);
      for (const sel of ['.lpg-in', '.lpg-rm', '.lpg-btn', '.lpg-link', '.lpg-sb', '.lpg-gp-pill']) {
        const heights = await page.locator(sel).evaluateAll((els) => els.filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect().height));
        expect(heights.length).toBeGreaterThan(0);
        for (const h of heights) expect(h, sel).toBeGreaterThanOrEqual(44);
      }
      // Telefonda haplar 5 × 3: her biri en az 44 px genişlikte.
      const pillW = await page.locator('.lpg-gp-pill').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
      for (const w of pillW) expect(w).toBeGreaterThanOrEqual(44);
    });
  }
}
