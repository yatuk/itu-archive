// Mobil yerleşim bekçisi (390 px): 9 sekmenin her biri, iki temada (sade / fosfor).
//
// Piksel karşılaştırması YOK: yazı tipi ve veri değişince kırılgan olur. Yalnızca
// anlamsal ölçümler: yatay taşma, "×" düğmesinin kutusu, dokunma hedefi boyutu ve
// panelin boş olmaması. İstenirse görüntüler yalnızca test eki olarak saklanır.
//
// Başka ajanlar görünümleri tembel yüklemeye geçirebilir; bu yüzden hiçbir yerde
// "veri hazır" varsayımı yok — her ölçümden önce panelin içeriği beklenir.

import { test, expect } from '@playwright/test';
import { sekmeyeGit } from './mobil-kabuk.js';

const SEKMELER = [
  'dersler',
  'dersplanim',
  'onsart',
  'sinavlar',
  'takvim',
  'program',
  'gecmis',
  'donemler',
  'hakkinda',
];

// Tema adı → <html data-theme> değeri (Fosfor, koyu temadır).
const TEMALAR = [
  { ad: 'sade', deger: 'sade' },
  { ad: 'fosfor', deger: 'dark' },
];

const MIN_HEDEF = 44;

/**
 * Bilinen, gerçek yerleşim hataları. Anahtar: `${sekme}/${tema}/${kontrol}`
 * ("*" tema her ikisini kapsar). Değer: kesin not. Bu durumlar test.fixme ile
 * işaretlenir; uygulama CSS'i bu spec tarafından DÜZELTİLMEZ.
 */
const BILINEN_HATALAR = {};

function bilinenHata(sekme, tema, kontrol) {
  return BILINEN_HATALAR[`${sekme}/${tema}/${kontrol}`] || BILINEN_HATALAR[`${sekme}/*/${kontrol}`];
}

/** Sekmeyi aç, temayı uygula ve panel içeriği oturana kadar bekle. */
async function sekmeyiAc(page, sekme, tema) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30_000 });

  // Tema: uygulamanın kendi düğmesi (kalıcı tercihi de o yazar).
  await page.locator(`.theme-btn[data-theme="${tema.deger}"]`).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', tema.deger);

  const sekmeDugmesi = page.locator(`#tab-${sekme}`);
  await sekmeyeGit(page, sekme);
  await expect(sekmeDugmesi).toHaveAttribute('aria-selected', 'true');

  const panel = page.locator(`#view-${sekme}`);
  await expect(panel).toBeVisible();
  // Boş iskelet/yer tutucu değil, gerçek içerik: görünür metin + en az bir öğe.
  await expect
    .poll(() => panel.evaluate((p) => p.innerText.trim().length), { timeout: 30_000 })
    .toBeGreaterThan(20);

  // Tembel yükleme / yazı tipi / animasyon yerleşimi oturana kadar iki kare bekle.
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return panel;
}

test.describe('Mobil yerleşim bekçisi · 390 px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const tema of TEMALAR) {
    for (const sekme of SEKMELER) {
      const baslik = `${sekme} · ${tema.ad}`;

      test.describe(baslik, () => {
        test.beforeEach(({ isMobile }) => {
          test.skip(!isMobile, 'Mobil yerleşim denetimi yalnız mobil projede çalışır.');
        });

        test('panel boş değil', async ({ page }, testInfo) => {
          test.fixme(!!bilinenHata(sekme, tema.ad, 'icerik'), bilinenHata(sekme, tema.ad, 'icerik'));
          const panel = await sekmeyiAc(page, sekme, tema);
          const metin = await panel.evaluate((p) => p.innerText.trim());
          expect(metin.length).toBeGreaterThan(20);
          // Yalnızca ek olarak sakla; karşılaştırma yapılmaz.
          await testInfo.attach('ekran', { body: await page.screenshot(), contentType: 'image/png' });
        });

        test('yatay sayfa taşması yok', async ({ page }) => {
          test.fixme(!!bilinenHata(sekme, tema.ad, 'tasma'), bilinenHata(sekme, tema.ad, 'tasma'));
          await sekmeyiAc(page, sekme, tema);
          const olcum = await page.evaluate(() => {
            const genislik = window.innerWidth;
            // Taşmaya neden olan öğeleri (en dıştaki birkaçı) tanı notuna ekle.
            const tasanlar = [...document.querySelectorAll('body *')]
              .filter((el) => el.getClientRects().length && el.getBoundingClientRect().right > genislik + 1)
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''}`);
            return { kaydirma: document.documentElement.scrollWidth, genislik, tasanlar };
          });
          expect(olcum.kaydirma, `scrollWidth ${olcum.kaydirma} > innerWidth ${olcum.genislik}; taşan: ${olcum.tasanlar.join(', ')}`).toBeLessThanOrEqual(olcum.genislik);
        });

        test('.search-clear düğmesi kendi girdisinin kutusunda kalır', async ({ page }) => {
          test.fixme(!!bilinenHata(sekme, tema.ad, 'clear'), bilinenHata(sekme, tema.ad, 'clear'));
          const panel = await sekmeyiAc(page, sekme, tema);

          // Düğme yalnız girdi doluyken görünür: panel içindeki her arama girdisini doldur.
          const girdiler = panel.locator('input[type="search"], input.search, .course-search input');
          const sayi = await girdiler.count();
          for (let i = 0; i < sayi; i++) {
            const girdi = girdiler.nth(i);
            if (await girdi.isVisible()) {
              await girdi.fill('a');
              await girdi.dispatchEvent('input');
            }
          }

          const sonuc = await panel.evaluate((p) => {
            const hatalar = [];
            let incelenen = 0;
            for (const dugme of p.querySelectorAll('.search-clear')) {
              if (!dugme.getClientRects().length) continue; // görünmeyeni atla
              const kap = dugme.parentElement;
              const girdi = kap.querySelector('input') || dugme.closest('label, div')?.querySelector('input');
              if (!girdi) continue;
              incelenen++;
              const d = dugme.getBoundingClientRect();
              const g = girdi.getBoundingClientRect();
              const tolerans = 0.5;
              if (d.left < g.left - tolerans || d.right > g.right + tolerans || d.top < g.top - tolerans || d.bottom > g.bottom + tolerans) {
                hatalar.push(`${girdi.id || girdi.className}: düğme [${[d.left, d.top, d.right, d.bottom].map(Math.round)}] girdi [${[g.left, g.top, g.right, g.bottom].map(Math.round)}]`);
              }
            }
            return { incelenen, hatalar };
          });
          expect(sonuc.hatalar, '.search-clear kutu dışına taşıyor').toEqual([]);
        });

        test(`ana görünümde etkileşimli kontroller ≥${MIN_HEDEF}px dokunma hedefi sunar`, async ({ page }) => {
          test.fixme(!!bilinenHata(sekme, tema.ad, 'hedef'), bilinenHata(sekme, tema.ad, 'hedef'));
          const panel = await sekmeyiAc(page, sekme, tema);

          const ihlaller = await panel.evaluate((p, min) => {
            const sonuc = [];
            const adi = (el) => {
              const sinif = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
              const metin = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24);
              return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${sinif} "${metin}"`;
            };
            // Etkin vuruş alanı: öğenin kutusu + ::after (inset:-8/-12px) genişletmesi.
            const vurusAlani = (el) => {
              const k = el.getBoundingClientRect();
              let sol = k.left, ust = k.top, sag = k.right, alt = k.bottom;
              const after = getComputedStyle(el, '::after');
              if (after.content !== 'none' && after.position === 'absolute') {
                const w = parseFloat(after.width), h = parseFloat(after.height);
                const t = parseFloat(after.top), l = parseFloat(after.left);
                if ([w, h, t, l].every(Number.isFinite)) {
                  sol = k.left + el.clientLeft + l;
                  ust = k.top + el.clientTop + t;
                  sag = sol + w;
                  alt = ust + h;
                }
              }
              return { w: sag - sol, h: alt - ust };
            };

            const adaylar = p.querySelectorAll('button, select, input:not([type="hidden"]), [role="button"], a[href]');
            for (const el of adaylar) {
              if (!el.getClientRects().length) continue;
              const stil = getComputedStyle(el);
              if (stil.visibility === 'hidden' || stil.pointerEvents === 'none') continue;
              if (el.disabled) continue;
              if (el.closest('[hidden], [inert], [aria-hidden="true"]')) continue;
              // Ekran okuyucuya ayrılmış / ekran dışı yardımcılar.
              if (el.closest('.sr-only, .skip-link')) continue;
              const k = el.getBoundingClientRect();
              if (k.width < 1 || k.height < 1) continue;
              // Yatay kaydırmalı şeritlerin dışında kalan (kırpılmış) öğeler değil, gerçekten görünenler.
              // Metin içindeki satır içi bağlantılar WCAG 2.5.8 gereği muaf: paragraf/liste/tablo hücresi içinde.
              if (el.tagName === 'A' && el.closest('p, li, td, th, dd, .prose, .lead, small, figcaption')) continue;
              // Onay kutusu/radyo: etiketiyle birlikte tek hedef sayılır.
              if (el.matches('input[type="checkbox"], input[type="radio"]')) {
                const etiket = el.closest('label') || (el.id && p.querySelector(`label[for="${CSS.escape(el.id)}"]`));
                if (etiket) {
                  const e = etiket.getBoundingClientRect();
                  if (e.height >= min - 0.1) continue;
                }
              }
              const { w, h } = vurusAlani(el);
              // Yalnız yükseklik: dar-ama-yüksek bağlantılar (ör. CSV, 21×44) WCAG 2.5.8 ile uyumlu; projenin mevcut kuralı da yükseklik.
              if (h < min - 0.1) {
                // Tekrarlayan satırlar tek kayda iner (aynı imza + aynı boyut): gürültüyü keser.
                const imza = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} ${Math.round(w)}×${Math.round(h)}`;
                const kayit = sonuc.find((x) => x.imza === imza);
                if (kayit) kayit.adet++;
                else sonuc.push({ imza, adet: 1, ornek: adi(el) });
              }
            }
            return sonuc.map((x) => `${x.imza} ×${x.adet} (örn. ${x.ornek})`);
          }, MIN_HEDEF);

          expect(ihlaller, 'dokunma hedefi < 44px').toEqual([]);
        });
      });
    }
  }
});

// Mobil kabuk (sade): alt sekme çubuğu, sayfa taşmaz. Fosfor değişmez.
test.describe('Mobil kabuk · sade alt sekme çubuğu', () => {
  for (const genislik of [375, 430]) {
    test(`${genislik}px: alt çubuk görünür, sayfa yatay taşmaz`, async ({ page }) => {
      await page.setViewportSize({ width: genislik, height: 900 });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30_000 });
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'sade');
      const cubuk = page.locator('.tabs.app-tabs');
      await expect(cubuk).toBeVisible();
      const kutu = await cubuk.boundingBox();
      // Çubuk ekranın altına yapışık.
      expect(Math.round(kutu.y + kutu.height)).toBe(900);
      for (const id of ['#tab-dersler', '#tab-program', '#tab-dersplanim', '#tab-onsart', '.mshell-more']) {
        const hedef = page.locator(id);
        await expect(hedef).toBeVisible();
        const k = await hedef.boundingBox();
        expect(k.height, `${id} dokunma yüksekliği`).toBeGreaterThanOrEqual(44);
        expect(k.y).toBeGreaterThanOrEqual(kutu.y - 1);
      }
      // İkincil görünümler çubukta değil, "Daha fazla" sayfasında.
      await expect(page.locator('#tab-sinavlar')).toBeHidden();
      for (const sekme of ['dersler', 'program', 'dersplanim', 'onsart', 'sinavlar']) {
        await sekmeyeGit(page, sekme);
        await expect(page.locator(`#view-${sekme}`)).toBeVisible();
        const { kaydirma, ic } = await page.evaluate(() => ({ kaydirma: document.documentElement.scrollWidth, ic: window.innerWidth }));
        expect(kaydirma, `${sekme}: yatay taşma`).toBeLessThanOrEqual(ic);
      }
      await expect(page.locator('html')).toHaveAttribute('data-active-view', 'sinavlar');
    });
  }

  test('Daha fazla sayfası: tema ve dil, Escape ile kapanır, odak geri döner', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 30_000 });
    const daha = page.locator('.mshell-more');
    await daha.click();
    const sayfa = page.locator('.mshell-sheet');
    await expect(sayfa).toBeVisible();
    await expect(sayfa).toHaveAttribute('aria-modal', 'true');
    await expect(daha).toHaveAttribute('aria-expanded', 'true');
    await sayfa.locator('[data-mshell-settings]').click();
    await expect(sayfa.locator('[data-mshell-theme="sade"]')).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await expect(sayfa).toBeHidden();
    await expect(daha).toBeFocused();
    // Fosfor seçilince sayfa kapanır, üst sekme rayı geri gelir (fosfor değişmez).
    await daha.click();
    await sayfa.locator('[data-mshell-settings]').click();
    await sayfa.locator('[data-mshell-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(sayfa).toBeHidden();
    await expect(daha).toBeHidden();
    const pos = await page.locator('.tabs.app-tabs').evaluate((el) => getComputedStyle(el).position);
    expect(pos).toBe('sticky');
  });

  test('Müfredat: seçili program özet kartında tam adıyla, seçici sayfada', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/?prog=SAO_OL#dersplanim');
    const kart = page.locator('.mshell-prog');
    await expect(kart).toBeVisible({ timeout: 20_000 });
    await expect(kart.locator('.mshell-prog-v')).toContainText('SAO_OL');
    await expect(page.locator('#dp-prog')).toBeHidden();
    await kart.locator('.mshell-prog-change').click();
    const sayfa = page.locator('.mshell-sheet');
    await expect(sayfa.locator('[data-mshell-set="dp-prog"][aria-checked="true"]')).toHaveCount(1);
    const tasma = await sayfa.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(tasma).toBeLessThanOrEqual(0);
    await sayfa.locator('.mshell-apply').click();
    await expect(sayfa).toBeHidden();
  });
});

test.describe('Marka logosu', () => {
  for (const [ad, vp] of [['masaüstü', { width: 1440, height: 900 }], ['mobil', { width: 390, height: 844 }]]) {
    test(`${ad}: sade başlıkta logo görünür, fosforda eski marka kalır`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/');
      const logo = page.locator('.brand-home .brand-wordmark img');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('alt', 'itu-ders');
      await expect(logo).toHaveAttribute('width', '313');
      await expect(logo).toHaveAttribute('height', '80');
      await expect.poll(() => logo.evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
      const k = await logo.boundingBox();
      expect(k.height).toBeGreaterThanOrEqual(28);
      expect(k.height).toBeLessThanOrEqual(40);
      await page.locator('.theme-btn[data-theme="dark"]').click();
      await expect(logo).toBeHidden();
      await expect(page.locator('.brand-home .brand-title')).toBeVisible();
      await expect(page.locator('.brand-home .brand-logo')).toBeVisible();
    });
  }

  test('statik sayfa başlığında da logo görünür', async ({ page }) => {
    await page.goto('/akademik-takvim/');
    await expect(page.locator('.brand-home .brand-wordmark img')).toBeVisible();
  });
});
