// Önşart haritası "Müfredat ve GPA" notlarını okur: son açılan programı
// önceden seçer, geçilen dersi yeşil (geçti), önşartı tamam olanı
// "alınabilir", FF'yi "kaldı" gösterir ve not değişince canlı tazelenir.
import { test, expect } from '@playwright/test';

const seed = (grades) => ({
  'itu-grades:v1': JSON.stringify({ version: 1, data: { CEN_LS: { grades, updatedAt: 1 } } }),
  'itu-grades-last-prog:v1': JSON.stringify({ version: 1, data: 'CEN_LS' }),
});

test('Önşart: Müfredat programı önceden seçilir, geçilen ders yeşil', async ({ page }) => {
  const items = seed({ 'MAT 103E': { grade: 'BB', prev: '' }, 'FIZ 101E': { grade: 'FF', prev: '' } });
  await page.addInitScript((kv) => {
    if (sessionStorage.getItem('pg-seeded')) return;
    for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v);
    sessionStorage.setItem('pg-seeded', '1');
  }, items);
  await page.goto('/#onsart');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30000 });
  await expect(page.locator('.pg-program-select')).toHaveValue('CEN_LS', { timeout: 30000 });
  await expect.poll(() => page.evaluate(() => location.search)).toContain('prog=CEN_LS');

  const li = (code) => page.locator(`.pg-li[data-code="${code}"]`);
  await expect(li('MAT 103E')).toHaveClass(/is-passed/, { timeout: 20000 });
  await expect(li('MAT 103E').locator('.pg-state-tag')).toHaveText('✓ geçti');
  await expect(li('FIZ 101E')).toHaveClass(/is-failed/);
  // MAT 104E'nin önşartı MAT 103E (MIN. DD) → alınabilir.
  await expect(li('MAT 104E')).toHaveClass(/is-eligible/);
  await expect(page.locator('#pg-root')).toHaveAttribute('data-passed', '1');
  await expect(page.locator('.pg-lg-passed')).not.toHaveAttribute('hidden', '');
  await expect(page.locator('.pg-lg-passed')).toContainText('(1)');

  // Kanvasta geçti rengi tema token'ından gelir (sade: koyu yeşil).
  const pass = await page.evaluate(() => getComputedStyle(document.getElementById('pg-root')).getPropertyValue('--pg-pass').trim());
  expect(pass).toMatch(/^#/);

  // Müfredat'ta not değişince (TAKEN_CHANGED) harita yeniden boyanır.
  await page.evaluate(() => {
    const env = JSON.parse(localStorage.getItem('itu-grades:v1'));
    env.data.CEN_LS.grades['FIZ 101E'] = { grade: 'CC', prev: 'FF' };
    localStorage.setItem('itu-grades:v1', JSON.stringify(env));
    window.dispatchEvent(new CustomEvent('itu:taken-changed'));
  });
  await expect(li('FIZ 101E')).toHaveClass(/is-passed/);
  await expect(page.locator('#pg-root')).toHaveAttribute('data-passed', '2');

  // 375 px'te yatay taşma yok.
  await page.setViewportSize({ width: 375, height: 800 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('Önşart: URL ?prog= Müfredat programından önce gelir', async ({ page }) => {
  const items = seed({ 'MAT 103E': { grade: 'AA', prev: '' } });
  await page.addInitScript((kv) => {
    for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v);
  }, items);
  await page.goto('/?prog=BLGE_LS#onsart');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30000 });
  await expect(page.locator('.pg-program-select')).toHaveValue('BLGE_LS', { timeout: 30000 });
});
