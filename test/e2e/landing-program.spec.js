// /ders-programi-olustur/ iniş sayfasındaki çalışan haftalık program örneği.
// Şubeler derleme anında aktif dönemden seçilir; bu yüzden CRN'lere değil
// davranışa bakılır: örnek görünür, varsayılan çakışmasız, örnek çakışma
// düğmesi (ya da çakışan şubeyi seçmek) çakışmayı gösterir, 390 px'te taşma yok.

import { test, expect } from '@playwright/test';

const SAYFA = '/ders-programi-olustur/';

test.describe('Ders programı oluştur örneği', () => {
  test('örnek sunucuda üretilmiş ve varsayılan çakışmasız', async ({ page }) => {
    await page.goto(SAYFA);
    const demo = page.locator('#lpp');
    await expect(demo).toBeVisible();
    expect(await demo.locator('.lpp-sel').count()).toBeGreaterThanOrEqual(3);
    expect(await demo.locator('.lpp-col .lpp-blk').count()).toBeGreaterThan(0);
    await expect(demo.locator('#lpp-status')).toHaveClass(/lpp-status--ok/);
    await expect(demo.locator('.lpp-blk--clash')).toHaveCount(0);
    await expect(page.locator('a[href="/#program"]').first()).toBeAttached();
    // Betik etkileşimli ipucunu açar.
    await expect(demo.locator('#lpp-hint')).toBeVisible();
  });

  test('çakışan şubeyi seçmek çakışmayı gösterir, sıfırlama geri alır', async ({ page }) => {
    await page.goto(SAYFA);
    const demo = page.locator('#lpp');
    await demo.locator('[data-lpp="clash"]').click();
    await expect(demo.locator('#lpp-status')).toHaveClass(/lpp-status--bad/);
    await expect(demo.locator('#lpp-status')).toContainText('çakışma');
    expect(await demo.locator('.lpp-blk--clash').count()).toBeGreaterThanOrEqual(2);
    await expect(demo.locator('.lpp-pick--bad')).toHaveCount(2);

    await demo.locator('[data-lpp="reset"]').click();
    await expect(demo.locator('#lpp-status')).toHaveClass(/lpp-status--ok/);
    await expect(demo.locator('.lpp-blk--clash')).toHaveCount(0);
  });

  test('seçimi elle değiştirmek çizelgeyi günceller', async ({ page }) => {
    await page.goto(SAYFA);
    const demo = page.locator('#lpp');
    // Örnek çakışmanın şubesini select üzerinden seç.
    const hint = demo.locator('[data-lpp="clash"]');
    await expect(hint).toBeVisible();
    const data = JSON.parse(await page.locator('#lpp-data').textContent());
    const [idx, crn] = data.x;
    await demo.locator(`#lpp-sel-${idx + 1}`).selectOption(crn);
    await expect(demo.locator('#lpp-status')).toHaveClass(/lpp-status--bad/);
    await expect(demo.locator('#lpp-sum')).toContainText(crn);
  });

  test('390 px genişlikte yatay taşma yok, seçimler en az 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const tema of ['sade', 'dark']) {
      await page.addInitScript((t) => { try { localStorage.setItem('itu-theme', t); } catch (e) {} }, tema);
      await page.goto(SAYFA);
      await page.locator('[data-lpp="clash"]').click();
      const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(tasma, `${tema}: sayfa yatay taşıyor`).toBeLessThanOrEqual(0);
      const demoKutu = await page.locator('#lpp').boundingBox();
      expect(demoKutu.x + demoKutu.width).toBeLessThanOrEqual(390);
      for (const h of await page.locator('.lpp-sel').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) {
        expect(h).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('İngilizce sayfa İngilizce örnek gösterir', async ({ page }) => {
    await page.goto('/en/schedule-builder/');
    const demo = page.locator('#lpp');
    await expect(demo).toBeVisible();
    await expect(demo.locator('#lpp-status')).toContainText('No conflicts');
    await demo.locator('[data-lpp="clash"]').click();
    await expect(demo.locator('#lpp-status')).toContainText('conflict');
  });
});
