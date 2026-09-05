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
  { yol: '/ders/blg-102e/', beklenenH1: /BLG 102E/ },
  { yol: '/brans/BLG/', beklenenH1: /BLG/ },
  { yol: '/hoca/muhammed-lutfi-yarar/', beklenenH1: /Muhammed Lütfi Yarar/ },
  { yol: '/gano-hesaplama/', beklenenH1: /GANO/ },
  { yol: '/ders-programi-olustur/', beklenenH1: /ders programı oluştur/i },
  { yol: '/sinav-programi/', beklenenH1: /sınav programı/i },
  { yol: '/akademik-takvim/', beklenenH1: /akademik takvim/i },
];

/** Arama niyetli sayfanın açması gereken gerçek uygulama görünümü. */
const ARAC_INIS_SAYFALARI = [
  { yol: '/gano-hesaplama/', hedef: '/#dersplanim', gorunum: '#view-dersplanim' },
  { yol: '/ders-programi-olustur/', hedef: '/#program', gorunum: '#view-program' },
  { yol: '/sinav-programi/', hedef: '/#sinavlar', gorunum: '#view-sinavlar' },
  { yol: '/akademik-takvim/', hedef: '/#takvim', gorunum: '#view-takvim' },
  { yol: '/ders-arsivi/', hedef: '/#gecmis', gorunum: '#view-gecmis' },
  { yol: '/ders-secimi/', hedef: '/#program', gorunum: '#view-program' },
];

// Kontenjan serisi yalnız kayıt haftalarında, sınav dosyası ise İTÜ takvimi
// yayımlandığında oluşur. İlgili görünümler eksik dosyayı dürüst bir boş durumla
// karşılar; tarayıcı yine de 404 yazar. Bu iki beklenen veri yokluğu dışındaki
// her konsol hatası testi kırar.
const BEKLENEN_404 = /data\/(?:quota\/.*|exams\/[^/]+)\.json/;

/** Konsol hatalarını toplar; testin sonunda boş olmalı. */
function konsolHatalari(page) {
  const hatalar = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const yer = m.location?.().url || '';
    if (BEKLENEN_404.test(yer) || BEKLENEN_404.test(m.text())) return;
    hatalar.push(`${yer || 'console'}: ${m.text()}`);
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
    await expect(page.locator('.tabs [data-view]').first()).toBeVisible();

    // Veri gerçekten geldi mi? Mobil gruplu liste, masaüstü tablo kullanır.
    const firstResult = page.viewportSize().width <= 640
      ? page.locator('#course-groups .mobile-course-group').first()
      : page.locator('#results tbody tr').first();
    await expect(firstResult).toBeVisible({ timeout: 15000 });

    expect(hatalar, `konsol hataları:\n${hatalar.join('\n')}`).toEqual([]);
  });

  test('modül yükleme hatasında boş tablo yerine kurtarma ekranı gösterir', async ({ page }) => {
    await page.route('**/assets/core/programs.js*', (route) => route.abort('failed'));
    await page.goto('/');

    const failure = page.locator('#app-failure');
    await expect(failure).toBeVisible({ timeout: 15000 });
    await expect(failure).toContainText('Ders verileri açılamadı');
    await expect(failure.locator('#app-retry')).toBeVisible();
    await expect(failure.getByRole('link', { name: 'Sorun bildir' })).toHaveAttribute('href', /github\.com\/yatuk\/itu-archive\/issues\/new/);
    await expect(page.locator('html')).toHaveAttribute('data-app-state', 'error');
    await expect(page.locator('#rows')).toContainText('Ders verileri yüklenemedi');
  });

  test('ana veri dosyası yüklenemezse aynı kurtarma yolunu sunar', async ({ page }) => {
    await page.route('**/data/index.json', (route) => route.abort('failed'));
    await page.goto('/');

    await expect(page.locator('#app-failure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#stat-status')).toContainText('uygulama başlatılamadı');
    await expect(page.locator('html')).toHaveAttribute('data-app-state', 'error');
  });

  test('ana görünümler art arda açılırken istemci hatası oluşmaz', async ({ page }) => {
    const hatalar = konsolHatalari(page);
    await page.goto('/');

    for (const view of ['dersplanim', 'onsart', 'sinavlar', 'takvim', 'program']) {
      await page.locator(`#tab-${view}`).click();
      await expect(page.locator(`#view-${view}`)).toBeVisible();
    }

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

  test('ana sayfa yüksek niyetli araç sayfalarını taranabilir bağlantılarla öne çıkarır', async ({ page }) => {
    await page.goto('/');

    const dizin = page.locator('.tool-directory');
    await expect(dizin).toBeVisible();
    for (const href of [
      '/ders-arsivi/',
      '/ders-programi-olustur/',
      '/gano-hesaplama/',
      '/ders-plani/',
      '/sinav-programi/',
      '/akademik-takvim/',
    ]) {
      await expect(dizin.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('ham veri bölümü aktif döneme ait indirilebilir adresler verir', async ({ page }) => {
    await page.goto('/#hakkinda');
    await expect(page.locator('.raw-current-csv')).toHaveAttribute('href', '/data/terms/2026-2027-guz/all.csv');
    await expect(page.locator('.raw-current-branch')).toHaveAttribute('href', '/data/terms/2026-2027-guz/branches/BIL.json');
    await expect(page.locator('.prose')).toContainText('curl.exe -fL --output');
  });

  test('iki tema da uygulanır ve tarayıcı çubuğu rengi eşleşir', async ({ page }) => {
    await page.goto('/');

    // Varsayılan sade (ana tema).
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sade');
    await expect(page.locator('meta[name=theme-color]')).toHaveAttribute('content', '#f4f6f4');
    await expect(page.locator('#statbar')).toBeHidden();

    // Koyu temaya geç — sade'nin yalnızca siyah hali, statbar burada da gizli.
    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name=theme-color]')).toHaveAttribute('content', '#0a0a0a');
    await expect(page.locator('#statbar')).toBeHidden();
  });

  test('mobil header ve gruplanmış ders listesi sıkışmadan çalışır', async ({ page }) => {
    test.skip(page.viewportSize().width > 600, 'Mobil yerleşim testi');
    await page.goto('/?term=2025-2026-yaz');
    const first = page.locator('#course-groups .mobile-course-group').first();
    await expect(first).toBeVisible({ timeout: 15000 });

    const brand = page.locator('.brand');
    const controls = page.locator('.mast-controls');
    const [brandBox, controlsBox] = await Promise.all([brand.boundingBox(), controls.boundingBox()]);
    expect(brandBox.y + brandBox.height).toBeLessThanOrEqual(controlsBox.y + 1);
    await expect(page.locator('.theme-name')).toHaveText(['Açık', 'Koyu']);
    await expect(page.locator('#lang-btn')).toBeVisible();

    for (const selector of ['.mobile-course-code', '.mobile-course-name', '.mobile-course-count', '.mobile-section', '.mobile-crn', '.mobile-schedule', '.mobile-quota', '.fav-star']) {
      await expect(first.locator(selector).first()).toBeVisible();
    }
    expect(await first.locator('.mobile-section:visible').count()).toBeLessThanOrEqual(4);
    const sectionBox = await first.locator('.mobile-section:visible').first().boundingBox();
    expect(sectionBox.height).toBeLessThan(110);
    const listType = await first.evaluate((el) => ({
      name: parseFloat(getComputedStyle(el.querySelector('.mobile-course-name')).fontSize),
      schedule: parseFloat(getComputedStyle(el.querySelector('.mobile-schedule')).fontSize),
    }));
    expect(listType.name).toBeGreaterThanOrEqual(16);
    expect(listType.schedule).toBeGreaterThanOrEqual(12);

    await first.locator('.mobile-section-open').first().click();
    await expect(page.locator('.detail-panel')).toBeVisible();
    const section = page.locator('.d-sec').first();
    await expect(section).toBeVisible();
    expect(parseFloat(await section.locator('.d-sec-when').evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(13);
    await page.locator('.detail-close').click();

    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    // Dark, sade'nin yalnızca siyah hâli: kontenjan aynı tek temsille kalır, fosfor çubuğu geri gelmez.
    await expect(first.locator('.mobile-quota').first()).toBeVisible();
    await expect(first.locator('.bar')).toHaveCount(0);
  });

  test('mobilde aynı dersin şubeleri tek başlıkta toplanır ve favori korunur', async ({ page }) => {
    test.skip(page.viewportSize().width > 600, 'Mobil yerleşim testi');
    await page.goto('/?q=TUR121');

    const group = page.locator('#course-groups .mobile-course-group').filter({ hasText: 'TUR 121' }).first();
    await expect(group).toBeVisible({ timeout: 15000 });
    await expect(group.locator('.mobile-course-code')).toContainText('TUR 121');
    expect(await group.locator('.mobile-course-name').count()).toBe(1);

    const declaredTotal = Number((await group.locator('.mobile-course-count').textContent()).match(/\d+/)?.[0]);
    const initialSections = await group.locator('.mobile-section').count();
    expect(declaredTotal).toBeGreaterThan(1);
    expect(initialSections).toBeLessThanOrEqual(4);
    expect(await group.locator('.mobile-section[hidden]').count()).toBe(0);
    const toggle = group.locator('.mobile-sections-toggle');
    if (declaredTotal > 4) {
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(await group.locator('.mobile-section').count()).toBe(declaredTotal);
      expect(await group.locator('.mobile-section:visible').count()).toBe(declaredTotal);
    }

    const star = group.locator('.fav-star').first();
    const before = await star.getAttribute('aria-pressed');
    await star.click();
    await expect(star).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true');
  });

  test('mobil ders listesi görünmeyen şubeleri kullanıcı istemeden DOM’a kurmaz', async ({ page }) => {
    test.skip(page.viewportSize().width > 600, 'Mobil performans regresyon testi');
    await page.goto('/?term=2026-2027-guz');
    await expect(page.locator('#course-groups .mobile-course-group').first()).toBeVisible({ timeout: 15000 });

    const initial = await page.locator('#course-groups').evaluate((root) => ({
      groups: root.querySelectorAll('.mobile-course-group').length,
      sections: root.querySelectorAll('.mobile-section').length,
      hidden: root.querySelectorAll('.mobile-section[hidden]').length,
    }));
    expect(initial.groups).toBe(30);
    expect(initial.sections).toBeLessThanOrEqual(initial.groups * 4);
    expect(initial.hidden).toBe(0);

    await page.locator('#more').click();
    await expect(page.locator('#course-groups .mobile-course-group')).toHaveCount(60);
    const appended = await page.locator('#course-groups').evaluate((root) => ({
      groups: root.querySelectorAll('.mobile-course-group').length,
      sections: root.querySelectorAll('.mobile-section').length,
      hidden: root.querySelectorAll('.mobile-section[hidden]').length,
    }));
    expect(appended.sections).toBeLessThanOrEqual(appended.groups * 4);
    expect(appended.hidden).toBe(0);
  });

  test('anlamlı görünüm tercihleri URL’den ayrıldıktan ve yenilendikten sonra korunur', async ({ page }) => {
    test.skip(page.viewportSize().width < 900, 'Tek tarayıcı kalıcılığı masaüstünde bir kez doğrulanır');
    await page.goto('/#dersler');
    await expect(page.locator('#rows tr').first()).toBeVisible({ timeout: 15000 });
    await page.locator('#q').fill('MAT');
    await expect(page).toHaveURL(/q=MAT/);
    await page.locator('#results th[data-sort="name"] .th-sort').click();
    await expect(page).toHaveURL(/q=MAT/);
    await page.goto('/#hakkinda');
    await page.reload();
    await page.locator('.tabs [data-view="dersler"]').click();
    await expect(page.locator('#q')).toHaveValue('MAT');
    await expect(page.locator('#results th[data-sort="name"]')).toHaveAttribute('aria-sort', 'ascending');

    await page.goto('/#program');
    await page.locator('#p-weekend').check();
    await page.locator('#p-fullday').check();
    await page.reload();
    await expect(page.locator('#p-weekend')).toBeChecked();
    await expect(page.locator('#p-fullday')).toBeChecked();

    await page.goto('/#takvim');
    await page.locator('#f-upcoming').uncheck();
    await page.goto('/#hakkinda');
    await page.goto('/#takvim');
    await expect(page.locator('#f-upcoming')).not.toBeChecked();

    await page.goto('/#sinavlar');
    await page.locator('#eq').fill('BLG');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('itu-exam-filters:v1')))
      .toContain('BLG');
    await page.locator('#tab-dersler').click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-app-state', 'ready', { timeout: 15000 });
    await expect(await page.evaluate(() => localStorage.getItem('itu-exam-filters:v1'))).toContain('BLG');
    await page.locator('#tab-sinavlar').click();
    await expect(page.locator('#eq')).toHaveValue('BLG');

    await page.goto('/#onsart');
    await expect(page.locator('.pg-level[data-level="LS"]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.pg-level[data-level="OL"]').click();
    await page.locator('.pg-list-toggle').click();
    await page.reload();
    await expect(page.locator('.pg-level[data-level="OL"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.pg-list-toggle')).toHaveAttribute('aria-pressed', 'true');

    const keys = await page.evaluate(() => Object.keys(localStorage));
    expect(keys.some((key) => key.endsWith(':v1'))).toBe(true);
    expect(keys.some((key) => /transcript/i.test(key))).toBe(false);
  });

  test('gruplanmış ders listesi 320–430 px aralığında yatay taşmaz', async ({ page }) => {
    test.skip(page.viewportSize().width > 600, 'Mobil yerleşim testi');
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 820 });
      await page.goto('/?q=TUR121');
      const group = page.locator('#course-groups .mobile-course-group').first();
      await expect(group).toBeVisible({ timeout: 15000 });
      const metrics = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        group: document.querySelector('.mobile-course-group').scrollWidth - document.querySelector('.mobile-course-group').clientWidth,
      }));
      expect(metrics.document, `${width}px belge taşması`).toBeLessThanOrEqual(1);
      expect(metrics.group, `${width}px ders grubu taşması`).toBeLessThanOrEqual(1);
    }
  });

  test('sade navigasyon düşük öncelikli sayfaları Daha fazla altında toplar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tabs .tab-number:visible')).toHaveCount(0);
    await expect(page.locator('#tab-dersplanim [data-i18n="tabDersplanim"]')).toHaveText('DERS PLANIM/GPA');
    await expect(page.locator('#tab-gecmis')).toBeHidden();
    await page.locator('#tabs-more-label').click();
    await page.locator('.tabs-more [data-nav-view="gecmis"]').click();
    await expect(page.locator('#view-gecmis')).toBeVisible();
    await expect(page.locator('#tabs-more-label')).toContainText('Geçmiş');

    // dark, sade'nin siyah sürümü: numaralı terminal dizisi ve Daha fazla
    // gruplaması burada da aynı — renk dışında yapısal fark yok.
    await page.locator('.theme-btn[data-theme="dark"]').click();
    await expect(page.locator('#tab-dersplanim .tab-number')).toBeHidden();
    await expect(page.locator('#tab-dersplanim [data-i18n="tabDersplanim"]')).toHaveText('DERS PLANIM/GPA');
    await expect(page.locator('#tab-gecmis')).toBeHidden();
    await expect(page.locator('.statbar')).toBeHidden();
    await expect(page.locator('.tagline-sade')).toBeVisible();
    await expect(page.locator('.tagline-fosfor')).toBeHidden();
    await page.locator('#tabs-more-label').click();
    await page.locator('.tabs-more [data-nav-view="gecmis"]').click();
    await expect(page.locator('#view-gecmis')).toBeVisible();
  });

  test('yeni sadeleştirme metinleri TR/EN geçişini izler', async ({ page }) => {
    await page.goto('/?lang=en');
    await expect(page.locator('.tagline-sade')).toHaveText('Search ITU courses, capacity, and past terms.');
    await expect(page.locator('.theme-name')).toHaveText(['Light', 'Dark']);
    await expect(page.locator('#f-filter-btn')).toHaveText('Filters (1)');
    if (page.viewportSize().width <= 600) await page.locator('#f-filter-btn').click();
    await expect(page.locator('#f-more-toggle')).toHaveText('More filters (1)');
    await expect(page.locator('#tabs-more-label')).toHaveText('More');
    await expect(page.locator('#tab-dersler [data-i18n="tabDersler"]')).toHaveText('COURSES');
  });

  test('kontenjan iki temada da tek temsile iner (fosfor çubuklu görünümü kaldırıldı)', async ({ page }) => {
    await page.goto('/');
    const mobile = page.viewportSize().width <= 640;
    const scope = mobile ? page.locator('#course-groups') : page.locator('#results');
    await expect(mobile ? scope.locator('.mobile-course-group').first() : scope.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

    for (const theme of ['sade', 'dark']) {
      await page.locator(`.theme-btn[data-theme="${theme}"]`).click();
      // Kont./Yazılan/Doluluk üçlüsü tek Kontenjan kolonuna iner — iki temada da aynı.
      await expect(page.locator('#results thead th:visible')).toHaveCount(mobile ? 0 : 8);
      await expect(scope.locator(mobile ? '.mobile-quota' : 'tbody .quota-main-col').filter({ hasText: '/' }).first()).toBeVisible();
      await expect(scope.locator('.bar:visible')).toHaveCount(0);
      await expect(scope.locator('.fill-measured')).toHaveCount(0);
      await expect(scope.locator('.quota-fosfor:visible')).toHaveCount(0);
    }
  });

  test('Sınavlar eski Yaz takvimi CDN cacheinden gelse bile Güz diye göstermez', async ({ page }) => {
    await page.route('**/data/exams/2026-2027-guz.json*', (route) => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        term: '2026-2027 Güz Dönemi',
        slug: '2026-2027-guz',
        exams: [
          { crn: '30054', code: 'SSI 518', name: 'Pazarlama Yönetimi', branch: 'SSI', date: '13 Ağustos 2026', day: 'Perşembe', time: '09:00-11:00', type: 'Final Sınavı' },
          { crn: '30055', code: 'SSI 511', name: 'Pazarlama Analitiği', branch: 'SSI', date: '11 Ağustos 2026', day: 'Salı', time: '12:00-14:00', type: 'Final Sınavı' },
        ],
      }),
    }));
    await page.goto('/#sinavlar');
    await expect(page.locator('#eresultline')).toHaveText('Bu dönem için sınav takvimi henüz ilan edilmemiş.');
    await expect(page.locator('#erows')).not.toContainText('30054');
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
  test('şubeden programa ekleme ve mobil günlük liste', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?term=2025-2026-yaz#ders/MAT-271E');
    await page.locator('[data-dtab="sections"]').click();
    const add = page.locator('[data-add-crn]').first();
    const crn = await add.getAttribute('data-add-crn');
    await add.click();
    await expect(page.locator('.toast').last()).toBeVisible();
    await page.locator('#detail-close').click();
    await page.locator('#tab-program').click();
    await expect(page.locator('#p-list')).toContainText(crn);
    await expect(page.locator('.p-agenda-session').first()).toBeVisible();
    await page.locator('#p-gridview').check();
    await expect(page.locator('#p-grid .tt-block').first()).toBeVisible();
    await page.locator('#tab-dersler').click();
    await page.locator('#q').fill('no-such-course-zzzz');
    await expect(page.locator('.filter-help')).toBeVisible();
    await page.locator('#chips [data-key="q"]').click();
    await expect(page.locator('.filter-help')).toHaveCount(0);
  });

  test('ana sekme seçimi hover ile örtülmez ve gezinme genişliğini değiştirmez', async ({ page }) => {
    await page.goto('/#dersler');
    await expect(page.locator('#tab-dersler')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.tabs-pill')).toHaveCount(0);
    for (const theme of ['dark', 'sade']) {
      await page.locator(`.theme-btn[data-theme="${theme}"]`).click();
      const width = (await page.locator('#tab-dersplanim').boundingBox()).width;
      for (const id of ['dersplanim', 'onsart', 'dersplanim']) {
        const tab = page.locator(`#tab-${id}`);
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        const colors = await tab.evaluate(el => {
          const s = getComputedStyle(el);
          const probe = document.createElement('span');
          probe.style.backgroundColor = 'var(--acid-vivid)';
          el.append(probe);
          const expected = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return { actual: s.backgroundColor, expected };
        });
        expect(colors.actual).toBe(colors.expected);
      }
      expect((await page.locator('#tab-dersplanim').boundingBox()).width).toBeCloseTo(width, 0);
    }
  });

  test('yenilenen başlık dar ekranda taşmaz ve azaltılmış hareketi korur', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?term=2025-2026-yaz#ders/MAT-271E');
    await expect(page.locator('.course-reader .d-name')).toBeVisible();
    await expect(page.locator('.course-reader .d-obs')).toBeVisible();
    expect(await page.locator('.course-reader .detail-box').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.locator('[data-dtab="overview"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-dtab="sections"]')).toBeFocused();
    await expect(page.locator('[data-dpanel="sections"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#detail-panel')).toBeHidden();
    const controls = await page.locator('.masthead-refined .mast-controls').boundingBox();
    const brand = await page.locator('.masthead-refined .brand-home').boundingBox();
    expect(controls.x + controls.width).toBeLessThanOrEqual(320);
    expect(brand.y + brand.height).toBeLessThanOrEqual(controls.y);
  });

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

    // Kullanıcının gerçek akışı: masaüstü satırı veya mobil şube satırı ilgili
    // şubeler sekmesini açar ve seçilen CRN'ye odaklanır.
    await page.locator('#detail-close').click();
    const firstSection = page.viewportSize().width <= 640
      ? page.locator('#course-groups .mobile-section-open').first()
      : page.locator('#results tbody tr').first();
    await firstSection.click();
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
  test('Dersler program filtresi varsayılan Lisansla başlar ve etiketleri eksiksizdir', async ({ page, isMobile }) => {
    await page.goto('/#dersler');
    await expect(page.locator('#f-level')).toHaveValue('LS');
    await expect.poll(async () => page.locator('#f-program option').count(), { timeout: 20000 }).toBeGreaterThan(20);
    const lisans = await page.locator('#f-program option').allTextContents();
    expect(lisans.slice(1).every((x) => / · Lisans$/.test(x))).toBe(true);
    const cen = lisans.find((x) => x.startsWith('CEN_LS ·'));
    expect(cen).toBe('CEN_LS · Bilgisayar Mühendisliği (İngilizce) (KKTC) · Lisans');

    if (isMobile) await page.locator('#f-filter-btn').click();
    await page.locator('#f-more-toggle').click();
    await page.locator('#f-level').selectOption('OL');
    await expect.poll(async () => page.locator('#f-program option').allTextContents()).toEqual(expect.arrayContaining([expect.stringMatching(/ · Önlisans$/)]));
    const onlisans = await page.locator('#f-program option').allTextContents();
    expect(onlisans.slice(1).every((x) => / · Önlisans$/.test(x))).toBe(true);
  });

  test('logo ve sekmeler gerçek derin bağlantı taşır', async ({ page }) => {
    await page.goto('/#program');
    await expect(page.locator('.brand-home')).toHaveAttribute('href', '/#dersler');
    await expect(page.locator('#tab-onsart')).toHaveAttribute('href', '/#onsart');
    await page.locator('.brand-home').click();
    await expect(page).toHaveURL(/\/#dersler$/);
    await expect(page.locator('#view-dersler')).toBeVisible();
  });

  test('Ders Planım sade hiyerarşisi ikincil araçları kontrollü açar', async ({ page }) => {
    await page.goto('/?prog=SAO_OL#dersplanim');
    await page.locator('#tab-dersplanim').click();
    await expect(page.locator('.dp-sem').first()).toBeVisible({ timeout: 20000 });

    await expect(page.locator('#dp-hide')).toHaveCount(0);
    await expect(page.locator('#dp-filter-more')).toBeHidden();
    await page.locator('#dp-filter-toggle').click();
    await expect(page.locator('#dp-filter-more')).toBeVisible();

    const order = await page.evaluate(() =>
      [...document.querySelectorAll('#dp-summary, #dp-semesters, #dp-grades, #dp-tools')].map((el) => el.id));
    expect(order).toEqual(['dp-summary', 'dp-semesters', 'dp-grades', 'dp-tools']);
    await expect(page.locator('#dp-tools')).not.toHaveAttribute('open', '');

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

  test('OBS transkript metni programı bulur, tekrarları son notla aktarır ve ham metni saklamaz', async ({ page }) => {
    const transcript = `Öğrenci Numarası : 000000000
Adı : TEST KULLANICISI
2023-2024 / Güz Dönemi
Ders Kodu Ders Adı Kredi Not
CEN 101E Intr. to Information Systems 2,00 FF *
MAT 103E Mathematics I 4,00 DC+
FIZ 101EL Physics I Laboratory 1,00 AA
KIM 101EL General Chemistry I Lab 1,00 BB
BLG 335E Analysis of Algorithms I 3,00 VF
A.Krd. B.Krd. O.K.Krd. B.Puan Ort.
Bilgisayar Mühendisliği (KKTC)
Dönem 6,00 2,00 6,00 3,00 0,50
2024-2025 / Bahar Dönemi
Ders Kodu Ders Adı Kredi Not
CEN 101E Intr. to Information Systems 2,00 BA+
CEN 223E Data Structures 3,50 CB+
ING 112A Basics of Academic Writing 2,00 CC+
FIZ 102EL Physics II Laboratory 1,00 BB+
CEN 335E Analysis of Algorithms I 3,00 CB
SNT 102E Photography 3,00 BA
ITB 205E Philosophy 3,00 BB
ZZZ 999 PRIVATE COURSE LABEL 2,00 AA
Toplam 11,50 9,50 11,50 26,00 2,26`;

    await page.goto('/#dersplanim');
    const open = page.locator('#dp-empty .dp-transcript-open');
    await expect(open).toBeVisible({ timeout: 20000 });
    await open.click();

    await expect(page.getByRole('dialog', { name: 'OBS transkriptinden notları aktar' })).toBeVisible();
    await expect(page.locator('.transcript-privacy')).toContainText('Ham transkript yüklenmez ve kaydedilmez');
    await expect(page.locator('.transcript-privacy')).toContainText('yalnız ders kodları ve notlar bu tarayıcıda kalır');
    const dialogLayout = await page.locator('.transcript-dlg-box').evaluate((box) => ({
      right: box.getBoundingClientRect().right,
      viewport: document.documentElement.clientWidth,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(dialogLayout.right).toBeLessThanOrEqual(dialogLayout.viewport + 1);
    expect(dialogLayout.pageOverflow).toBeLessThanOrEqual(1);
    await page.locator('#transcript-input').fill(transcript);
    await expect(page.locator('#transcript-preview')).toContainText('13 kayıt · 12 farklı ders');
    await expect(page.locator('#transcript-preview')).toContainText('CEN_LS');
    await expect(page.locator('.transcript-dlg .dlg-ok')).toBeEnabled();
    await page.locator('.transcript-dlg .dlg-ok').click();

    await expect(page.locator('#dp-prog')).toHaveValue('CEN_LS', { timeout: 20000 });
    await expect(page.locator('.dp-grade[data-gcode="CEN 101E"]')).toHaveValue('BA+');
    await expect(page.locator('.dp-grade[data-gcode="CEN 223E"]')).toHaveValue('CB+');
    await expect(page.locator('.dp-grade[data-gcode="FIZ 101EL"]')).toHaveValue('AA');
    await expect(page.locator('.dp-grade[data-gcode="KIM 101EL"]')).toHaveValue('BB');
    await expect(page.locator('.dp-grade[data-gcode="FIZ 102EL"]')).toHaveValue('BB+');
    await expect(page.locator('.dp-grade[data-gcode="ING 112A"]')).toHaveValue('CC+');
    await expect(page.locator('.dp-grade[data-gcode="CEN 335E"]')).toHaveValue('CB');
    await expect(page.locator('.dp-repeat-btn[data-gcode="CEN 335E"]')).toHaveAttribute('title', /önceki: VF/);
    await expect(page.locator('.dp-epick[data-slot="s3i5"]')).toHaveValue('SNT 102E');
    await expect(page.locator('.dp-epick[data-slot="s6i5"]')).toHaveValue('ITB 205E');
    await expect(page.locator('.dp-repeat-btn[data-gcode="CEN 101E"]')).toHaveAttribute('title', /önceki: FF/);
    await expect(page.locator('#dp-transcript-result')).toContainText('10 not aktarıldı');
    await expect(page.locator('#dp-transcript-result')).toContainText('1 ders elle kontrol edilmeli');

    const stored = await page.evaluate(() => localStorage.getItem('itu-grades:v1') || '');
    expect(stored).not.toContain('TEST KULLANICISI');
    expect(stored).not.toContain('PRIVATE COURSE LABEL');
    expect(JSON.parse(stored).data.CEN_LS.requiredSlots).toEqual({
      s0i1: 'FIZ 101EL', s0i8: 'KIM 101EL', s1i3: 'ING 112A', s1i6: 'FIZ 102EL',
    });
    expect(await page.locator('.transcript-dlg').count()).toBe(0);
  });

  test('Ders Planım: BL/M/G/P notu girilince "Dönem için ders öner" çökmez', async ({ page }) => {
    // Yaşanmış hata: EXEMPT bir Set ama passedCodes() EXEMPT.includes()
    // çağırıyordu (Array metodu). Kullanıcının gerçek transkriptinde bile
    // "BL" notlu ders var (TUR/DAN gibi muaf dersler) — bu satır her tetiklendiğinde
    // TypeError fırlatıp öneri panelini sessizce kırıyordu.
    await page.goto('/?prog=BLGE_LS#dersplanim');
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      localStorage.setItem('itu-grades:v1', JSON.stringify({
        version: 1,
        data: { BLGE_LS: { grades: { 'TUR 121': { grade: 'BL', prev: '' } }, elective: {}, updatedAt: Date.now() } },
      }));
    });
    await page.reload();
    await page.waitForTimeout(1500);
    const hatalar = [];
    page.on('pageerror', (e) => hatalar.push(String(e)));
    await page.locator('#dp-tools > summary').click();
    await page.locator('#dp-recommend > summary').click();
    await page.locator('#dp-recommend-run').click();
    await page.waitForTimeout(800);
    expect(hatalar.filter((h) => /EXEMPT/.test(h))).toEqual([]);
    await expect(page.locator('#dp-recommend-result')).not.toBeEmpty();
  });

  test('Ders Planım: "Dengeli plan oluştur" önşart sırasını koruyan çok dönemli bir plan üretir', async ({ page }) => {
    await page.goto('/?prog=CEN_LS#dersplanim');
    await page.waitForTimeout(1500);
    await page.locator('#dp-tools > summary').click();
    await page.locator('#dp-balanced > summary').click();
    await page.locator('#dp-balanced-run').click();
    await expect.poll(
      async () => page.locator('.dp-balanced-term').count(),
      { timeout: 15000, message: 'dengeli plan dönemleri render edilmeli' }
    ).toBeGreaterThan(0);

    // Önşart sırası: MAT 103E (1. dönem) her zaman MAT 104E'den (2. dönem) önce gelmeli.
    const donemler = await page.locator('#dp-balanced-result').evaluate((el) =>
      [...el.querySelectorAll('.dp-balanced-term')].map((t) =>
        [...t.querySelectorAll('.dp-balanced-list b')].map((b) => b.textContent))
    );
    const donemOf = (code) => donemler.findIndex((d) => d.includes(code));
    const mat103 = donemOf('MAT 103E'), mat104 = donemOf('MAT 104E');
    if (mat103 >= 0 && mat104 >= 0) expect(mat104).toBeGreaterThan(mat103);

    // Kredi tavanı: hiçbir dönem sert tavanı (18) aşmamalı.
    const kredi = await page.locator('.dp-balanced-term-head span').allTextContents();
    for (const k of kredi) expect(Number(k.replace(/[^\d.,]/g, '').replace(',', '.'))).toBeLessThanOrEqual(18);

    // 1. dönemin bu dönem açık dersleri tıklanabilir olmalı: kutucuk +
    // "Seçilenleri programa ekle" — Program sekmesine gerçekten ders ekler.
    const checkboxSayisi = await page.locator('[data-balanced-code]').count();
    expect(checkboxSayisi).toBeGreaterThan(0);
    await page.locator('#dp-balanced-add').click();
    await expect(page.locator('#view-program')).toBeVisible();
    await expect(page.locator('.p-item').first()).toBeVisible({ timeout: 5000 });
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
    // Program kullanıcının açık seçimi olmadan ilk kayda düşmez.
    await expect(page.locator('#dp-prog')).toHaveValue('');
    await expect(page.locator('#dp-empty')).toBeVisible();
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

  test('Önşart: ?prog= deep-link URL\'de kalıcı, ilk ziyarette program otomatik seçilir', async ({ page }) => {
    // Yaşanmış hata: courses.js'nin saveState()'i Dersler aktif sekme
    // OLMASA BİLE boot sırasında (loadTerm/loadQuota içinden) çalışıp URL'i
    // kendi (boş) form alanlarından yeniden kuruyordu — Önşart Haritası'nın
    // ?prog= parametresi birkaç saniye içinde sessizce siliniyordu.
    await page.goto('/?prog=CEN_LS#onsart');
    await expect.poll(() => page.url(), { timeout: 8000 }).toContain('prog=CEN_LS');
    await page.waitForTimeout(1000); // gecikmeli boot çağrıları (loadQuota vb.) için ek bekleme
    expect(page.url()).toContain('prog=CEN_LS');

    // İlk ziyaret (URL'de ?prog= yok, hatırlanan tercih yok): program otomatik
    // ilk seçeneğe düşer ve bu seçim URL'e yansır (Ders Planım'daki fakülte→
    // bölüm davranışıyla tutarlı).
    await page.goto('/#onsart');
    await expect.poll(
      async () => page.locator('.pg-program-select').inputValue(),
      { timeout: 8000 }
    ).not.toBe('');
    expect(page.url()).toContain('prog=');
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
  test('alternatifler gerçek şube farkını gösterir ve klavye odağını korur', async ({ page }) => {
    const rows = [
      ['90001', 'MAT 271E', 'Probability', 'MAT', 'First Instructor', 'Pazartesi 09:30/11:29', 40, 10, 'LS', ''],
      ['90002', 'MAT 271E', 'Probability', 'MAT', 'Second Instructor', 'Perşembe 13:30/15:29', 50, 20, 'LS', ''],
      ['90003', 'FIZ 101E', 'Physics', 'FIZ', 'Physics Instructor', 'Pazartesi 09:30/11:29', 60, 30, 'LS', ''],
    ];
    await page.route('**/data/terms/2025-2026-yaz/search.json*', (route) => route.fulfill({ json: rows }));
    await page.goto('/?term=2025-2026-yaz#program');
    await expect(page.locator('#p-altfind')).toBeDisabled();
    for (const crn of ['90001', '90003']) {
      await page.locator('#p-q').fill(crn);
      await page.locator('.p-result').first().click();
    }
    await page.locator('#p-altfind').click();
    const dialog = page.locator('.af-dlg');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#af-close')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#af-run')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#af-close')).toBeFocused();
    await page.locator('[data-af-preset="compact"]').click();
    await expect(page.locator('[data-af-preset="compact"]')).toBeFocused();
    await page.locator('#af-run').click();
    const diff = page.locator('.af-diff').first();
    await expect(diff).toContainText('90001 → 90002');
    await expect(diff).toContainText('First Instructor → Second Instructor');
    await expect(diff).toContainText('Perşembe');
    await expect(diff).toContainText('20');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('#p-altfind')).toBeFocused();
    await expect(page.locator('.p-crn').first()).toContainText('90001');
    await page.locator('#p-altfind').click();
    await page.locator('#af-run').click();
    await page.locator('[data-af-apply]').first().click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('#p-list')).toContainText('90002');
    await expect(page.locator('#p-altfind')).toBeFocused();
  });
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

  async function programIslemi(page, selector) {
    const menu = page.locator('.p-progmenu');
    if (!(await menu.evaluate((el) => el.open))) await menu.locator(':scope > summary').click();
    await page.locator(selector).click();
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
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('itu-programs:v1')).data.programs[0].items)).toHaveLength(0);

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

  test('ızgara bloğu sağ tık menüsünden kaldırılır ve geri alınır', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobil program gün listesi satır menüsünü kullanır; bağlam menüsü masaüstü ızgarasınındır.');
    await programiAc(page);
    await arayipEkle(page);
    const block = page.locator('.tt-block').first();
    await expect(block).toBeVisible();
    await block.click({ button: 'right' });
    const menu = page.locator('.tt-context-menu');
    await expect(menu).toBeVisible();
    await expect(menu).toContainText('Programdan çıkar');
    await menu.locator('[data-act="remove"]').click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    await page.locator('.toast-action', { hasText: 'geri al' }).click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);
  });

  test('mobilde eklenen ders tablosu, çıkarma ve geri alma birlikte güncellenir', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await programiAc(page);

    await expect(page.locator('#p-list .empty')).toContainText('Henüz ders eklenmedi');
    await arayipEkle(page);

    const satir = page.locator('#p-list .p-item').first();
    await expect(page.locator('.p-panel-head h2')).toContainText('Eklenen dersler');
    await expect(page.locator('#p-list .p-list-head')).toBeVisible();
    await expect(satir.locator('.p-code')).toContainText('MAT 271E');
    await expect(satir.locator('.p-crn')).toContainText(/CRN\s*\d+/);
    await expect(satir.locator('.p-when')).not.toHaveText('Zaman açıklanmadı');
    await expect(page.locator('#p-grid .tt-daytabs')).toBeVisible();
    await expect(satir.locator('[data-copy]')).toHaveCount(0);
    const firstDay = (await satir.locator('.p-when').innerText()).trim().split(/\s+/)[0];
    const expectedDay = { Pazartesi: 'Pzt', Salı: 'Sal', Çarşamba: 'Çar', Perşembe: 'Per', Cuma: 'Cum', Cumartesi: 'Cmt', Pazar: 'Paz' }[firstDay];
    await expect(page.locator('.tt-daytab.active')).toHaveText(expectedDay);

    await satir.locator('.p-menu').click();
    await expect(satir.locator('[data-act="copy-crn"]')).toBeVisible();
    await expect(satir.locator('[data-act="copy-code"]')).toBeVisible();
    await expect(satir.locator('[data-act="copy-instructor"]')).toBeVisible();
    await page.keyboard.press('Escape');

    const removeBox = await satir.locator('.p-remove').boundingBox();
    expect(removeBox.width).toBeGreaterThanOrEqual(44);
    expect(removeBox.height).toBeGreaterThanOrEqual(44);
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      const overflow = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        list: document.querySelector('#p-list').scrollWidth - document.querySelector('#p-list').clientWidth,
      }));
      expect(overflow.page, `${width}px belge taşması`).toBeLessThanOrEqual(1);
      expect(overflow.list, `${width}px eklenen dersler taşması`).toBeLessThanOrEqual(1);
    }

    await satir.locator('.p-remove').click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    await expect(page.locator('#p-list .empty')).toBeVisible();
    await page.locator('.toast-action', { hasText: 'geri al' }).click();
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);
    await expect(page.locator('#p-grid .tt-daytabs')).toBeVisible();
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

    await programIslemi(page, '#p-prog-new');
    await expect(page.locator('#p-prog option')).toHaveCount(2);
    await expect(page.locator('#p-list .p-item')).toHaveCount(0);
    await programIslemi(page, '#p-prog-rename');
    await page.locator('.dlg-input').fill('Salı Planı');
    await page.locator('.dlg-ok').click();
    await expect(page.locator('#p-prog option:checked')).toHaveText('Salı Planı');

    await arayipEkle(page);
    await programIslemi(page, '#p-prog-copy');
    await expect(page.locator('#p-prog option')).toHaveCount(3);
    await expect(page.locator('#p-prog option:checked')).toContainText('(kopya)');
    await expect(page.locator('#p-list .p-item')).toHaveCount(1);

    await programIslemi(page, '#p-prog-del');
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
    if (page.viewportSize().width > 700) {
      const canvasHeight = await page.locator('.pg-canvas-wrap').evaluate((el) => el.getBoundingClientRect().height);
      expect(canvasHeight).toBeGreaterThanOrEqual(419);
      expect(canvasHeight).toBeLessThanOrEqual(561);
    }

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

  test('mobilde dönem listesi ve odak ilişkileri masaüstü canvası yerine okunur', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await haritayiAc(page);
    const explorer = page.locator('.pg-mobile-explorer');
    await expect(explorer).toBeVisible();
    await expect(page.locator('.pg-workspace')).toBeHidden();
    const first = explorer.locator('[data-focus-code]').first();
    const sourceName = await first.locator('em').textContent();
    expect(sourceName?.trim().length).toBeGreaterThan(2);
    await first.click();
    await expect(explorer.locator('.pg-mobile-selected')).toBeVisible();
    await expect(explorer.locator('.pg-mobile-selected h2')).toHaveText(sourceName.trim());
    await expect(explorer.locator('.pg-mobile-back')).toBeVisible();
    await page.locator('.pg-list-toggle').click();
    await expect(page.locator('.pg-canvas-wrap')).toBeVisible();
  });

  test('seçmeli havuz bağlantısı, arama, sıralama, ders detayı ve kapatma çalışır', async ({ page }) => {
    await haritayiAc(page, '&pool=TM%20Elective%20II');
    await expect(page.locator('#pg-root')).toHaveClass(/pg-has-detail/);
    await expect(page.locator('.pg-detail-head')).toContainText('TM Elective II');
    await expect(page.locator('.pg-pool-status')).toContainText('alternatif', { timeout: 20000 });

    // Panel grid'i daralttığında canvas bitmap'i de CSS kutusuyla aynı ölçüye
    // gelmeli; aksi halde son dönem sütunları sıkışıp yinelenmiş görünür.
    const canvas = page.locator('.pg-canvas-wrap canvas');
    if (!(await canvas.isVisible())) {
      await page.locator('.pg-list-toggle').click();
      await expect(canvas).toBeVisible();
    }
    await expect.poll(() => canvas.evaluate((el) =>
      Math.abs(el.width - Math.round(el.clientWidth * (window.devicePixelRatio || 1))) <= 1,
    )).toBe(true);
    const detailWidth = await canvas.evaluate((el) => el.clientWidth);

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
    await expect.poll(() => canvas.evaluate((el) =>
      Math.abs(el.width - Math.round(el.clientWidth * (window.devicePixelRatio || 1))) <= 1,
    )).toBe(true);
    if ((page.viewportSize()?.width || 0) > 1000) {
      await expect.poll(() => canvas.evaluate((el) => el.clientWidth)).toBeGreaterThan(detailWidth + 200);
    }
    expect(new URL(page.url()).searchParams.has('pool')).toBe(false);
  });

  test('havuz satırında ders adı rozet/eylem sütunlarına ezilmez', async ({ page }) => {
    // Kullanıcı bildirimi: masaüstünde havuz paneli her zaman dar (bkz.
    // .pg-root.pg-has-detail .pg-workspace: 300-340px sabit — pencere
    // genişlemez). "1fr auto auto" tek satırda rozet (~99px) + eylemler
    // (~125px) ad sütununu ~40px'e eziyordu; overflow-wrap:anywhere ile
    // ders adı harf harf dikey akıyordu ("S/e/ç/m/e/l/i" gibi).
    await haritayiAc(page, '&pool=TM%20Elective%20III');
    await expect(page.locator('.pg-pool-status')).toContainText('alternatif', { timeout: 20000 });

    const ad = page.locator('.pg-pool-row .pg-pool-name').first();
    await expect(ad).toBeVisible();
    const kutu = await ad.boundingBox();
    expect(kutu.width, 'ders adı sütunu okunabilir genişlikte olmalı').toBeGreaterThan(100);

    const em = page.locator('.pg-pool-row .pg-pool-name em').first();
    const emKutu = await em.boundingBox();
    expect(emKutu.height, 'ders adı birkaç satıra sarmamalı (tek/iki satır)').toBeLessThan(40);
  });
});

test.describe('Sekme URL izolasyonu', () => {
  // Yaşanmış hata sınıfı (courses.js'te bulundu, exams.js/history.js/
  // dersplanim.js'de de vardı): bir sekmenin asenkron veri yüklemesi
  // (loadExams/loadHistory/plan fetch) kullanıcı BAŞKA bir sekmeye geçtikten
  // SONRA tamamlanırsa, geç gelen yanıt URL'i (hash dahil) kendi sekmesine
  // geri yazıyordu — paylaşılabilir/geri tuşu URL'i sessizce bozuluyordu.
  async function yavaslat(page, pattern) {
    await page.route(pattern, async (route) => {
      await new Promise((r) => setTimeout(r, 1200));
      await route.continue();
    });
  }

  test('Sınavlar: geç gelen veri başka sekmedeyken URL\'i bozmaz', async ({ page }) => {
    await yavaslat(page, '**/data/exams/**');
    await page.goto('/#sinavlar');
    await page.waitForTimeout(200);
    await page.locator('#tab-onsart').click();
    await page.waitForTimeout(1800);
    expect(page.url()).not.toContain('#sinavlar');
  });

  test('Geçmiş: geç gelen veri başka sekmedeyken URL\'i bozmaz', async ({ page }) => {
    await yavaslat(page, '**/data/history/**');
    await page.goto('/#gecmis');
    await page.waitForTimeout(200);
    await page.locator('#tab-onsart').click();
    await page.waitForTimeout(1800);
    expect(page.url()).not.toContain('#gecmis');
  });

  test('Ders Planım: geç gelen veri başka sekmedeyken URL\'i bozmaz', async ({ page }) => {
    await yavaslat(page, '**/data/curriculum/**');
    await page.goto('/?prog=CEN_LS#dersplanim');
    await page.waitForTimeout(200);
    await page.locator('#tab-onsart').click();
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('#dersplanim');
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

  test('hoca sayfası · arama niyeti özeti ve güvenli schema', async ({ page }) => {
    await page.goto('/hoca/muhammed-lutfi-yarar/');

    await expect(page).toHaveTitle(/İTÜ'de Verdiği Dersler/);
    await expect(page.locator('.seo-stats')).toContainText('farklı ders');
    await expect(page.locator('.seo-stats')).toContainText('son kayıt');
    await expect(page.locator('.seo-instructor-courses')).toBeVisible();
    await expect(page.locator('.seo-data-note')).toContainText('resmî personel profili değildir');

    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    expect(graph.some((item) => item['@type'] === 'Person')).toBe(true);
    expect(graph.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);
    expect(JSON.stringify(graph)).not.toContain('affiliation');
  });

  for (const { yol, hedef, gorunum } of ARAC_INIS_SAYFALARI) {
    test(`${yol} · birincil eylem gerçek aracı açar`, async ({ page }) => {
      await page.goto(yol);

      const anaEylem = page.locator('.seo-tool-launch .btn-primary');
      await expect(anaEylem).toBeVisible();
      await expect(anaEylem).toHaveAttribute('href', hedef);
      await anaEylem.click();

      await expect(page).toHaveURL(new RegExp(`${hedef.replace('/', '\\/')}$`));
      await expect(page.locator(gorunum)).toBeVisible();
    });
  }

  test('landing sayfası breadcrumb ve güncellenme sinyali taşır', async ({ page }) => {
    await page.goto('/ders-arsivi/');

    await expect(page.locator('.crumb')).toContainText('İTÜ Ders Arşivi');
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    expect(graph.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);
    expect(graph.some((item) => item['@type'] === 'WebPage' && item.dateModified === '2026-08-23')).toBe(true);
    await expect(page.locator('.seo-action-list a[href="/ders-programi/"]')).toBeVisible();
    await expect(page.locator('.seo-action-list a[href="/kontenjan/"]')).toBeVisible();
  });
});

test.describe('Düzen bütünlüğü', () => {
  // Kayıt haftasında birincil bağlam telefon: sayfa gövdesi asla yatay kaymamalı.
  // Geniş içerik (tablo) kendi kabında kayar.
  for (const yol of ['/', '/ders/blg-102e/', '/dersler/2025-2026-bahar/', '/gano-hesaplama/', '/ders-programi-olustur/']) {
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
