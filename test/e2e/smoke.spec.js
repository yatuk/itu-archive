// Tarayıcı duman testleri.
//
// Neden var: Go testleri kazıyıcıyı, node --test saf fonksiyonları, cmd/validate
// veri bütünlüğünü koruyor — ama hiçbiri sayfayı açmıyordu. Sayfayı yalnızca
// tarayıcıda açınca görünen hatalar (stil hiç uygulanmaması, yatay taşma, veri
// gelmesine rağmen boş tablo) bu boşluktan geçiyordu.
//
// Buradaki her assertion gerçekten yaşanmış bir hataya karşılık gelir.

import { test, expect } from '@playwright/test';

/** Üretilen SEO sayfalarından her tipten bir örnek. */
const SEO_SAYFALARI = [
  { yol: '/dersler/2025-2026-bahar/', beklenenH1: /Bahar Dönemi/ },
  { yol: '/ders/BLG-102E/', beklenenH1: /BLG 102E/ },
  { yol: '/brans/BLG/', beklenenH1: /BLG/ },
  { yol: '/gano-hesaplama/', beklenenH1: /GANO/ },
];

// Kontenjan serisi yalnızca kayıt haftalarında ölçülür; henüz ölçülmemiş dönem
// için dosya yoktur. courses.js bunu try/catch ile bilerek karşılar
// ("bu dönem için henüz ölçüm yok"), ama tarayıcı 404'ü yine de konsola yazar.
// Beklenen tek istisna budur — başka her konsol hatası testi kırar.
const BEKLENEN_404 = /data\/quota\/.*\.json/;

/** Konsol hatalarını toplar; testin sonunda boş olmalı. */
function konsolHatalari(page) {
  const hatalar = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const yer = m.location?.().url || '';
    if (BEKLENEN_404.test(yer) || BEKLENEN_404.test(m.text())) return;
    hatalar.push(m.text());
  });
  page.on('pageerror', (e) => hatalar.push(String(e)));
  return hatalar;
}

test.describe('SPA (ana sayfa)', () => {
  test('açılır, konsol temiz, ders verisi gerçekten basılır', async ({ page }) => {
    const hatalar = konsolHatalari(page);
    await page.goto('/');

    // Masthead ve sekmeler yerinde mi?
    await expect(page.locator('.brand-title, .brand h1').first()).toBeVisible();
    await expect(page.locator('.tabs button').first()).toBeVisible();

    // Veri gerçekten geldi mi? (docs/data bozulursa tablo boş kalır — bu,
    // scrape yeşil görünürken sitenin sessizce boşalmasını yakalar.)
    await expect(page.locator('#results tbody tr').first()).toBeVisible({ timeout: 15000 });

    expect(hatalar, `konsol hataları:\n${hatalar.join('\n')}`).toEqual([]);
  });

  test('iki tema da uygulanır ve tarayıcı çubuğu rengi eşleşir', async ({ page }) => {
    await page.goto('/');

    // Varsayılan sade (ana tema).
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sade');
    await expect(page.locator('meta[name=theme-color]')).toHaveAttribute('content', '#f4f6f4');

    // Fosfora geç.
    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name=theme-color]')).toHaveAttribute('content', '#050806');
  });

  test('"İçeriğe atla" ilk odak durağıdır ve odaklanınca görünür olur', async ({ page }) => {
    await page.goto('/');

    // Yapı: DOM sırasında ilk odaklanabilir öğe olmalı — masthead ve 9 sekme
    // klavye kullanıcısının önüne çıkmadan içeriğe inebilsin.
    // (Tab tuşuyla ölçmüyoruz: SPA açılışta kaydırdığı için Chromium'un
    // "sequential focus starting point"ı sayfa ortasına kayabiliyor.)
    const ilkOdaklanabilir = await page.evaluate(() => {
      const el = document.querySelector('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      return el?.className;
    });
    expect(ilkOdaklanabilir).toContain('skip-link');

    // Davranış: odaksızken ekran dışında (top: -100px), odaklanınca içeri girer.
    const skip = page.locator('.skip-link');
    expect(await skip.evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(0);
    await skip.focus();
    expect(
      await skip.evaluate((el) => el.getBoundingClientRect().top),
      'skip link odaklanınca görünür olmalı'
    ).toBeGreaterThanOrEqual(0);

    // Hedefi gerçekten var mı?
    await expect(page.locator('#icerik')).toHaveCount(1);
  });
});

test.describe('SEO sayfaları', () => {
  for (const { yol, beklenenH1 } of SEO_SAYFALARI) {
    test(`${yol} · tek h1, stilli nav, konsol temiz`, async ({ page }) => {
      const hatalar = konsolHatalari(page);
      await page.goto(yol);

      // Sayfa başına tek h1 — masthead h1 olarak kalırsa SEO'da konu sulanır.
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(beklenenH1);

      // Nav <a> ile kurulur; `.tabs` stili yalnızca `button` hedeflerse
      // bağlantılar padding'siz ve altı çizili kalır (yaşanmış hata).
      const navLink = page.locator('.tabs a').first();
      await expect(navLink).toBeVisible();
      const stil = await navLink.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { padding: cs.padding, decoration: cs.textDecorationLine };
      });
      expect(stil.padding, 'nav bağlantısı hap dolgusunu almalı').not.toBe('0px');
      expect(stil.decoration).toBe('none');

      expect(hatalar, `konsol hataları:\n${hatalar.join('\n')}`).toEqual([]);
    });
  }
});

test.describe('Düzen bütünlüğü', () => {
  // Kayıt haftasında birincil bağlam telefon: sayfa gövdesi asla yatay kaymamalı.
  // Geniş içerik (tablo) kendi kabında kayar.
  for (const yol of ['/', '/ders/BLG-102E/', '/dersler/2025-2026-bahar/']) {
    test(`${yol} · sayfa yatay taşmaz`, async ({ page }) => {
      await page.goto(yol);
      await page.waitForLoadState('networkidle');

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(
        scrollWidth,
        `gövde ${scrollWidth}px, viewport ${clientWidth}px — geniş içerik kendi kabında kaymalı`
      ).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});
