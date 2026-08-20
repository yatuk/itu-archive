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

  test('temel filtreler önde, ikincil filtreler kontrollü açılır', async ({ page }) => {
    await page.goto('/');
    const mobile = page.viewportSize().width <= 600;
    if (mobile) await page.locator('#f-filter-btn').click();

    await expect(page.locator('#f-open')).toBeVisible();
    await expect(page.locator('#f-more-toggle')).toBeVisible();
    for (const sel of ['#f-level', '#f-method', '#f-program', '#f-code']) {
      await expect(page.locator(sel)).toBeHidden();
    }
    await page.locator('#f-more-toggle').click();
    for (const sel of ['#f-level', '#f-method', '#f-program', '#f-code']) {
      await expect(page.locator(sel)).toBeVisible();
    }
    await expect(page.locator('#taken-btn, #f-taken')).toHaveCount(0);
  });

  test('iki tema da uygulanır ve tarayıcı çubuğu rengi eşleşir', async ({ page }) => {
    await page.goto('/');

    // Varsayılan sade (ana tema).
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sade');
    await expect(page.locator('meta[name=theme-color]')).toHaveAttribute('content', '#f4f6f4');
    await expect(page.locator('#statbar')).toBeHidden();

    // Fosfora geç.
    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name=theme-color]')).toHaveAttribute('content', '#050806');
    await expect(page.locator('#statbar')).toBeVisible();
  });

  test('mobil header ve ders kartı sıkışmadan, okunabilir sırada çalışır', async ({ page }) => {
    test.skip(page.viewportSize().width > 600, 'Mobil yerleşim testi');
    await page.goto('/?term=2025-2026-yaz');
    const first = page.locator('#results tbody tr').first();
    await expect(first).toBeVisible({ timeout: 15000 });

    const brand = page.locator('.brand');
    const controls = page.locator('.mast-controls');
    const [brandBox, controlsBox] = await Promise.all([brand.boundingBox(), controls.boundingBox()]);
    expect(brandBox.y + brandBox.height).toBeLessThanOrEqual(controlsBox.y + 1);
    await expect(page.locator('.theme-name')).toHaveText(['Açık', 'Koyu']);
    await expect(page.locator('#lang-btn')).toBeVisible();

    for (const selector of ['.code', '.crn', '.fav', '.course-name', '.course-instructor', '.course-schedule', '.quota-main-col']) {
      await expect(first.locator(selector)).toBeVisible();
    }
    expect(await first.locator('.course-schedule span').count()).toBeGreaterThan(1);
    const cardBox = await first.boundingBox();
    expect(cardBox.height).toBeLessThan(240);
    const cardType = await first.evaluate((el) => ({
      name: parseFloat(getComputedStyle(el.querySelector('.row-toggle')).fontSize),
      schedule: parseFloat(getComputedStyle(el.querySelector('.course-schedule')).fontSize),
    }));
    expect(cardType.name).toBeGreaterThanOrEqual(16);
    expect(cardType.schedule).toBeGreaterThanOrEqual(12);

    await first.click();
    await expect(page.locator('.detail-panel')).toBeVisible();
    const section = page.locator('.d-sec').first();
    await expect(section).toBeVisible();
    expect(parseFloat(await section.locator('.d-sec-when').evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(13);
    await page.locator('.detail-close').click();

    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(first.locator('.bar')).toBeVisible();
  });

  test('sade navigasyon düşük öncelikli sayfaları Daha fazla altında toplar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#tab-gecmis')).toBeHidden();
    await page.locator('#tabs-more-label').click();
    await page.locator('.tabs-more [data-nav-view="gecmis"]').click();
    await expect(page.locator('#view-gecmis')).toBeVisible();
    await expect(page.locator('#tabs-more-label')).toContainText('Geçmiş');
  });

  test('yeni sadeleştirme metinleri TR/EN geçişini izler', async ({ page }) => {
    await page.goto('/?lang=en');
    await expect(page.locator('.tagline-sade')).toHaveText('Search ITU courses, capacity, and past terms.');
    await expect(page.locator('.theme-name')).toHaveText(['Light', 'Dark']);
    await expect(page.locator('#f-filter-btn')).toHaveText('Filters (0)');
    if (page.viewportSize().width <= 600) await page.locator('#f-filter-btn').click();
    await expect(page.locator('#f-more-toggle')).toHaveText('More filters');
    await expect(page.locator('#tabs-more-label')).toHaveText('More');
  });

  test('sade kontenjanı tek temsile indirir, fosfor eski çubuğu korur', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#results tbody tr').first()).toBeVisible({ timeout: 15000 });
    const mobile = page.viewportSize().width <= 640;

    // Sade: Kont./Yazılan/Doluluk üçlüsü tek Kontenjan kolonuna iner.
    await expect(page.locator('#results thead th:visible')).toHaveCount(mobile ? 0 : 8);
    await expect(page.locator('#results tbody .quota-main-col').filter({ hasText: '/' }).first()).toBeVisible();
    await expect(page.locator('#results .bar:visible')).toHaveCount(0);
    await expect(page.locator('#results .fill-measured')).toHaveCount(0);

    // Fosfor dondurulmuş görünümü: iki sayı kolonu ve yüzde + bar geri gelir.
    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('#results thead th:visible')).toHaveCount(mobile ? 0 : 10);
    await expect(page.locator('#results .bar:visible').first()).toBeVisible();
    await expect(page.locator('#results tbody .quota-fosfor').filter({ hasText: '%' }).first()).toBeVisible();
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

test.describe('Ders detay paneli', () => {
  test('tek uzun belge yerine dört erişilebilir sekme kullanır', async ({ page }) => {
    const hatalar = konsolHatalari(page);
    await page.goto('/?term=2025-2026-yaz#ders/MAT-271E');

    const panel = page.locator('#detail-panel');
    await expect(panel).toBeVisible();
    await expect(page.locator('.d-tabs [role="tab"]')).toHaveCount(4);
    await expect(page.locator('[data-dtab="overview"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-dpanel="overview"]')).toBeVisible();
    await expect(page.locator('[data-dpanel="sections"]')).toBeHidden();

    await page.locator('[data-dtab="sections"]').click();
    await expect(page.locator('[data-dpanel="sections"] .d-sec').first()).toBeVisible();
    await expect(page.locator('[data-dpanel="sections"] .d-instr-history').first()).toBeVisible();

    await page.locator('[data-dtab="history"]').click();
    await expect(page.locator('.d-history-records')).toBeVisible();
    await expect(page.locator('.d-history-records')).not.toHaveAttribute('open', '');
    await expect(page.locator('.d-history-records .htable')).toBeHidden();

    // Kullanıcının gerçek akışı: tablo satırından gelince doğrudan ilgili şubeler açılır.
    await page.locator('#detail-close').click();
    await page.locator('#results tbody tr').first().click();
    await expect(page.locator('[data-dtab="sections"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.d-sec.is-focus')).toHaveCount(1);
    expect(hatalar, `konsol hataları:\n${hatalar.join('\n')}`).toEqual([]);
  });

  test('modalda yalnızca içerik alanı kayar ve yatay taşma oluşmaz', async ({ page }) => {
    await page.goto('/?term=2025-2026-yaz#ders/MAT-271E');
    await expect(page.locator('.d-panels')).toBeVisible();
    const layout = await page.evaluate(() => {
      const box = document.querySelector('.detail-box');
      const content = document.querySelector('#detail-content');
      const panels = document.querySelector('.d-panels');
      return {
        boxOverflow: getComputedStyle(box).overflowY,
        contentOverflow: getComputedStyle(content).overflowY,
        panelOverflow: getComputedStyle(panels).overflowY,
        boxRight: box.getBoundingClientRect().right,
        viewport: document.documentElement.clientWidth,
      };
    });
    expect(layout.boxOverflow).toBe('hidden');
    expect(layout.contentOverflow).toBe('hidden');
    expect(layout.panelOverflow).toBe('auto');
    expect(layout.boxRight).toBeLessThanOrEqual(layout.viewport + 1);
  });
});

test.describe('Program seçimi (fakülte → bölüm)', () => {
  test('Ders Planım sade hiyerarşisi ikincil araçları kontrollü açar', async ({ page }) => {
    await page.goto('/?prog=SAO_OL#dersplanim');
    await page.locator('#tab-dersplanim').click();
    await expect(page.locator('.dp-sem').first()).toBeVisible({ timeout: 20000 });

    await expect(page.locator('#dp-hide')).toHaveCount(0);
    await expect(page.locator('#dp-filter-more')).toBeHidden();
    await page.locator('#dp-filter-toggle').click();
    await expect(page.locator('#dp-filter-more')).toBeVisible();

    const gpa = page.locator('#dp-grades');
    await expect(gpa).not.toHaveAttribute('open', '');
    await gpa.locator(':scope > summary').click();
    await expect(gpa).toHaveAttribute('open', '');
    await page.locator('.dp-grade').first().selectOption('AA');
    await expect(page.locator('#dp-grade-preview')).toContainText('GANO');

    const semester = page.locator('.dp-sem').first();
    await expect(semester).toHaveAttribute('open', '');
    await semester.locator(':scope > summary').click();
    await expect(semester).not.toHaveAttribute('open', '');
  });

  test('Ders Planım: fakülte seçimi bölüm listesini daraltır', async ({ page }) => {
    await page.goto('/');
    await page.locator('#tab-dersplanim').click();
    // Müfredat indeksi geç yüklenir; fakülteler dolana kadar bekle.
    await expect.poll(
      async () => page.locator('#dp-fac option').count(),
      { timeout: 20000, message: 'fakülte seçicisi dolmalı' }
    ).toBeGreaterThan(10);

    await page.selectOption('#dp-fac', { label: 'Mimarlık Fakültesi' });

    // Liste yeniden kurulurken okumamak için dolmasını bekle.
    await expect.poll(
      async () => page.locator('#dp-prog option').count(),
      { timeout: 20000, message: 'bölüm listesi seçilen fakülteyle dolmalı' }
    ).toBeGreaterThan(0);

    const bolumler = await page.locator('#dp-prog option').allTextContents();
    // Daralma gerçek olmalı: 313 programın tamamı listelenmemeli.
    expect(bolumler.length).toBeLessThan(50);
    expect(bolumler.some((b) => /Mimarlık/i.test(b))).toBe(true);
    // Seçim otomatik ilk bölüme düşer, boş kalmaz.
    await expect(page.locator('#dp-prog')).not.toHaveValue('');
  });

  test('Seçmeli slot adı ders seçicinin altında ezilmez', async ({ page }) => {
    // <select>'in doğal genişliği en uzun ders adından gelir; ızgaranın `auto`
    // sütununu şişirip slot adını tek karakter genişliğine ezerdi
    // ("S/e/ç/m/e/l/i" dikey akıyordu).
    await page.goto('/?prog=SAO_OL#dersplanim');
    await page.locator('#tab-dersplanim').click();

    const ad = page.locator('.dp-elective .dp-elective-name').first();
    await expect(ad).toBeVisible({ timeout: 20000 });

    const kutu = await ad.boundingBox();
    expect(kutu.width, 'slot adı okunabilir genişlikte olmalı').toBeGreaterThan(120);
    expect(kutu.height, 'slot adı birkaç satıra sarmamalı').toBeLessThan(40);
  });

  test('Önşart: fakülte seçicisi dolar, bölüm listesi gruplu değil', async ({ page }) => {
    await page.goto('/');
    await page.locator('#tab-onsart').click();

    const fac = page.locator('.pg-faculty-select');
    // Önşart grafiği veriyi geç yükler: yer tutucu ("yükleniyor…") gerçek
    // fakültelerle değişene kadar bekle.
    await expect.poll(
      async () => fac.locator('option').count(),
      { timeout: 20000, message: 'fakülte seçicisi dolmalı' }
    ).toBeGreaterThan(5);
    await expect(fac).not.toHaveValue(/yükleniyor/i);

    // İki adımlı seçimde tek listedeki optgroup gruplaması kalkar.
    expect(await page.locator('.pg-program-select optgroup').count()).toBe(0);
  });
});

test.describe('Haftalık program kurucu', () => {
  async function programiAc(page) {
    await page.goto('/?term=2025-2026-yaz#program');
    await expect(page.locator('#p-q')).toBeVisible();
    await expect(page.locator('#p-prog option')).toHaveCount(1);
  }

  async function arayipEkle(page, sorgu = 'MAT 271E') {
    await page.locator('#p-q').fill(sorgu);
    await expect(page.locator('#p-results .p-result').first()).toBeVisible();
    await page.locator('#p-results .p-result').first().click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);
  }

  test('ders ekleme, tekrar engeli, görünür çıkarma, geri alma ve temizleme çalışır', async ({ page }) => {
    await programiAc(page);
    await arayipEkle(page);

    await expect(page.locator('.p-remove')).toBeVisible();
    await expect(page.locator('#p-clear')).toBeEnabled();

    // Aynı CRN ikinci kez eklenmez.
    await page.locator('#p-q').fill('MAT 271E');
    await page.locator('#p-results .p-result').first().click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);

    // Satırdaki görünür eylem gerçekten localStorage kaydını da kaldırır.
    await page.locator('.p-remove').click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('itu-programs')).programs[0].items)).toHaveLength(0);

    await page.locator('.toast-action', { hasText: 'geri al' }).click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);

    // Diğer eylemler menüsü sonradan üretildiği hâlde işlevsel kalır.
    await page.locator('.p-menu').click();
    await expect(page.locator('.p-menu-pop')).toBeVisible();
    await page.locator('.p-menu-pop [data-act="remove"]').click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    await page.locator('.toast-action', { hasText: 'geri al' }).click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);

    // Temizleme iptal edilebilir; onaydan sonra program boşalır ve araçlar kapanır.
    await page.locator('#p-clear').click();
    await expect(page.locator('.dlg-title')).toHaveText('Programı temizle');
    await page.locator('.dlg-cancel').click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);
    await page.locator('#p-clear').click();
    await page.locator('.dlg-ok').click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    await expect(page.locator('#p-clear')).toBeDisabled();
    await expect(page.locator('#p-csv')).toBeDisabled();
  });

  test('bölümden seçim, yeni program, adlandırma, kopyalama ve silme çalışır', async ({ page }) => {
    await programiAc(page);

    // Zincir seçici hem vazgeçme hem gerçek ekleme akışını destekler.
    await page.locator('#p-addrow').click();
    await expect(page.locator('.p-row')).toHaveCount(1);
    await page.locator('.p-row-del').click();
    await expect(page.locator('.p-row')).toHaveCount(0);
    await page.locator('#p-addrow').click();
    await page.locator('.p-row-branch').selectOption({ index: 1 });
    await page.locator('.p-row-course').selectOption({ index: 1 });
    await page.locator('.p-row-crn').selectOption({ index: 1 });
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);

    await page.locator('#p-prog-new').click();
    await expect(page.locator('#p-prog option')).toHaveCount(2);
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    await page.locator('#p-prog-rename').click();
    await page.locator('.dlg-input').fill('Salı Planı');
    await page.locator('.dlg-ok').click();
    await expect(page.locator('#p-prog option:checked')).toHaveText('Salı Planı');

    await arayipEkle(page);
    await page.locator('#p-prog-copy').click();
    await expect(page.locator('#p-prog option')).toHaveCount(3);
    await expect(page.locator('#p-prog option:checked')).toContainText('(kopya)');
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);

    await page.locator('#p-prog-del').click();
    await expect(page.locator('.dlg-title')).toHaveText('Programı sil');
    await page.locator('.dlg-ok').click();
    await expect(page.locator('#p-prog option')).toHaveCount(2);
  });

  test('dışa aktarma, paylaşma ve OBS CRN çıktısı seçime göre etkinleşir', async ({ page }) => {
    await programiAc(page);
    await expect(page.locator('#p-dl')).toBeDisabled();
    await expect(page.locator('#p-ics')).toBeDisabled();
    await arayipEkle(page);
    await page.locator('.p-export').evaluate((el) => { el.open = true; });

    const csv = page.waitForEvent('download');
    await page.locator('#p-csv').click();
    expect((await csv).suggestedFilename()).toMatch(/program-.*\.csv/);

    const ics = page.waitForEvent('download');
    await page.locator('#p-ics').click();
    expect((await ics).suggestedFilename()).toMatch(/itu-program-.*\.ics/);

    const png = page.waitForEvent('download');
    await page.locator('#p-dl').click();
    expect((await png).suggestedFilename()).toMatch(/program-.*\.png/);

    await page.locator('#p-share').click();
    await expect(page.locator('.toast').last()).toContainText('kopyalandı');
    await page.locator('#p-obs').click();
    await expect(page.locator('#p-obs-code')).toBeVisible();
    await expect(page.locator('#p-obs-code')).toContainText(/CRN|301/);
  });
});

test.describe('Önşart haritası', () => {
  async function haritayiAc(page, suffix = '') {
    await page.goto(`/?prog=BLGE_LS${suffix}#onsart`);
    await expect(page.locator('.pg-program-select')).toHaveValue('BLGE_LS');
    await expect(page.locator('.pg-status')).toContainText('ders/slot', { timeout: 20000 });
  }

  test('program seçimi, seviye filtresi, ders arama, odak ve görünüm geçişi çalışır', async ({ page }) => {
    await haritayiAc(page);
    await expect(page.locator('.pg-picker')).toBeVisible();
    await expect(page.locator('.pg-level')).toHaveCount(4);
    await expect(page.locator('.pg-level[data-level="LS"]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.pg-guide > summary').click();
    await expect(page.locator('.pg-guide > div')).toContainText('Zorunlu önşart');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

    // Seviye kapatılınca seçili lisans programı düşer; yeniden açınca seçilebilir olur.
    await page.locator('.pg-level[data-level="LS"]').click();
    await expect(page.locator('.pg-level[data-level="LS"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.pg-program-select')).toHaveValue('');
    await page.locator('.pg-level[data-level="LS"]').click();
    await expect(page.locator('.pg-level[data-level="LS"]')).toHaveAttribute('aria-pressed', 'true');

    // Programı tekrar seçip arama sonucundan bir derse odaklan.
    await page.locator('.pg-faculty-select').selectOption({ label: 'Bilgisayar ve Bilişim Fakültesi' });
    await page.locator('.pg-program-select').selectOption('BLGE_LS');
    await expect(page.locator('.pg-status')).toContainText('ders/slot', { timeout: 20000 });
    await page.locator('.pg-search').fill('BLG 102E');
    await expect(page.locator('.pg-results .pg-chip').first()).toBeVisible();
    await page.locator('.pg-results .pg-chip').first().click();
    await expect(page.locator('#pg-root')).toHaveClass(/pg-has-detail/);
    await expect(page.locator('.pg-detail')).toBeVisible();
    await expect(page.locator('.pg-reset')).toBeEnabled();

    await page.locator('.pg-reset').click();
    await expect(page.locator('.pg-detail')).toBeHidden();
    await expect(page.locator('.pg-reset')).toBeDisabled();

    // Mobil listeyle, masaüstü grafikle başlar; düğme her iki yönde de geçiş yapar.
    const before = await page.locator('.pg-list-toggle').getAttribute('aria-pressed');
    await page.locator('.pg-list-toggle').click();
    await expect(page.locator('.pg-list-toggle')).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true');
    if (before === 'true') await expect(page.locator('.pg-canvas-wrap')).toBeVisible();
    else await expect(page.locator('.pg-semester-list')).toBeVisible();
  });

  test('seçmeli havuz bağlantısı, arama, sıralama, ders detayı ve kapatma çalışır', async ({ page }) => {
    await haritayiAc(page, '&pool=TM%20Elective%20II');
    await expect(page.locator('#pg-root')).toHaveClass(/pg-has-detail/);
    await expect(page.locator('.pg-detail-head')).toContainText('TM Elective II');
    await expect(page.locator('.pg-pool-status')).toContainText('alternatif', { timeout: 20000 });

    await page.locator('.pg-pool-search').fill('BLG 337E');
    await expect(page.locator('.pg-pool-row')).toHaveCount(1);
    await page.locator('.pg-pool-sort').selectOption('open');
    await expect(page.locator('.pg-pool-row')).toHaveCount(1);

    await page.locator('.pg-pool-row [data-act="detay"]').click();
    await expect(page.locator('#detail-panel')).toBeVisible();
    await page.locator('#detail-close').click();
    await expect(page.locator('.pg-detail')).toBeVisible();

    await page.locator('.pg-detail-close').click();
    await expect(page.locator('.pg-detail')).toBeHidden();
    expect(new URL(page.url()).searchParams.has('pool')).toBe(false);
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
