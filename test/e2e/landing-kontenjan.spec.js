// /kontenjan/ iniş sayfası: derleme anında hesaplanan özet şeridi, "En hızlı
// dolan dersler" tablosu, istemci taraflı arama süzgeci ve dar ekran düzeni.
import { test, expect } from '@playwright/test';

test.describe('Kontenjan iniş sayfası', () => {
  test('özet şeridi ve tablo sunucuda üretilmiş', async ({ page }) => {
    await page.goto('/kontenjan/');
    const stats = page.locator('.lpk-stats > div');
    await expect(stats).toHaveCount(4);
    for (const label of ['Şube', 'Kontenjanlı', 'Dolu', 'Son ölçüm']) {
      await expect(page.locator('.lpk-stats dt', { hasText: label })).toHaveCount(1);
    }
    // Her sayı gerçek metin: rakam içeren <strong>.
    for (const txt of await page.locator('.lpk-stats strong').allTextContents()) {
      expect(txt).toMatch(/\d/);
    }
    await expect(page.locator('#lpk-body tr[data-lpk-row]')).toHaveCount(10);
    await expect(page.locator('.lpk-free li')).toHaveCount(4);
    // Ders kodları ders sayfasına bağlanır.
    const href = await page.locator('#lpk-body a.lpk-code').first().getAttribute('href');
    expect(href).toMatch(/^\/ders\/[a-z0-9-]+\/$/);
  });

  test('arama tablo satırlarını süzer', async ({ page }) => {
    await page.goto('/kontenjan/');
    const q = page.locator('#lpk-q');
    await expect(q).toBeVisible();
    const rows = page.locator('#lpk-body tr[data-lpk-row]');
    const firstCode = (await rows.first().locator('.lpk-code').textContent()).trim();
    // Boşluksuz ve küçük harfle yazılan kod da eşleşir.
    await q.fill(firstCode.replace(/\s+/g, '').toLowerCase());
    await expect(page.locator('#lpk-body tr[data-lpk-row]:visible')).toHaveCount(1);
    await expect(page.locator('#lpk-empty')).toBeHidden();
    await q.fill('zzzz-yok');
    await expect(page.locator('#lpk-body tr[data-lpk-row]:visible')).toHaveCount(0);
    await expect(page.locator('#lpk-empty')).toBeVisible();
    await q.fill('');
    await expect(page.locator('#lpk-body tr[data-lpk-row]:visible')).toHaveCount(10);
  });

  test('390px genişlikte yatay taşma yok', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/kontenjan/');
    const m = await page.evaluate(() => {
      const wrap = document.querySelector('.lpk-tblwrap');
      return {
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        table: wrap.scrollWidth - wrap.clientWidth,
      };
    });
    expect(m.doc).toBeLessThanOrEqual(0);
    expect(m.table).toBeLessThanOrEqual(0);
    // Dokunma hedefleri en az 44px.
    for (const sel of ['#lpk-q', '#lpk-body a.lpk-code']) {
      const box = await page.locator(sel).first().boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
