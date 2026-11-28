// Müfredat ve GPA: "Mezuniyete ne kaldı" kartı, "Hangi dersi tekrar alsam"
// listesi ve akademik durum (gözetim / onur) satırları. Tüm notlar sentetiktir;
// gerçek kişiye ait veri yoktur.

import { test, expect } from '@playwright/test';

const PROG = 'CEN_LS';

// Sentetik notlar (CEN_LS planındaki kodlar). 30,5 kredi notlu, 26,5 geçilmiş
// → 1. sınıf; GANO ≈ 2,20. Düşük notlar: MAT 103E FF (4 kr), MAT 104E DD (4 kr),
// FIZ 102E DC (3 kr).
const NOTLAR_A = {
  'FIZ 101E': 'BB', 'CEN 101E': 'AA', 'CEN 115E': 'BA', 'MAT 103E': 'FF', 'CEN 104E': 'CB', 'ING 100': 'BB',
  'MAT 104E': 'DD', 'CEN 102E': 'BA', 'CEN 103E': 'CC', 'FIZ 102E': 'DC',
};
const KREDI = {
  'FIZ 101E': 3, 'CEN 101E': 2, 'CEN 115E': 1.5, 'MAT 103E': 4, 'CEN 104E': 3, 'ING 100': 3,
  'MAT 104E': 4, 'CEN 102E': 4, 'CEN 103E': 3, 'FIZ 102E': 3,
};

function seedA() {
  const grades = Object.fromEntries(Object.entries(NOTLAR_A).map(([c, g]) => [c, { grade: g, prev: '' }]));
  const entries = Object.entries(NOTLAR_A).map(([c, g]) => ({ code: c, credits: KREDI[c], grade: g, key: `g:${c}` }));
  const planKeys = Object.fromEntries(Object.entries(NOTLAR_A).map(([c, g]) => [`g:${c}`, g]));
  return {
    grades,
    elective: {},
    transcript: {
      officialGpa: null,
      entries,
      planKeys,
      terms: [
        { term: '2025-2026 / Güz', gpa: 1.95, credits: 16.5, passedCredits: 12.5, hasFail: true },
        { term: '2025-2026 / Bahar', gpa: 2.43, credits: 14, passedCredits: 14, hasFail: false },
      ],
    },
  };
}

// Gözetim senaryosu: GANO 0,83 (1. sınıf eşiği 1,80).
function seedB() {
  const notlar = { 'FIZ 101E': 'DD', 'CEN 104E': 'DD', 'MAT 103E': 'FF', 'CEN 101E': 'CC' };
  return { grades: Object.fromEntries(Object.entries(notlar).map(([c, g]) => [c, { grade: g, prev: '' }])), elective: {} };
}

async function open(page, data) {
  await page.addInitScript(([prog, d]) => {
    localStorage.setItem('itu-grades:v1', JSON.stringify({ version: 1, data: { [prog]: { ...d, updatedAt: 1 } } }));
  }, [PROG, data]);
  await page.goto(`/?prog=${PROG}#dersplanim`);
  await expect(page.locator('#dp-semesters .dp-course').first()).toBeVisible({ timeout: 20000 });
}

async function noHorizontalOverflow(page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'sayfa yatay taşmamalı').toBeLessThanOrEqual(cw + 1);
}

test.describe('Müfredat ve GPA · mezuniyet, tekrar, akademik durum', () => {
  test('mezuniyet kartı kalan kredi/AKTS, zorunlu ders ve tahmini dönemi gösterir', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await open(page, seedA());
    const card = page.locator('#dp-grad');
    await expect(card).toBeVisible();
    await expect(card.locator('h3')).toHaveText('Mezuniyete ne kaldı');
    // 130 − 26,5 geçilen kredi.
    await expect(card.locator('.dp-grad-stat').first()).toContainText('103,5');
    await expect(card.locator('.dp-grad-stat').first()).toContainText('130 üzerinden');
    await expect(card).toContainText('Kalan AKTS');
    await expect(card.locator('.dp-grad-est')).toContainText(/\d{4}-\d{4} (Güz|Bahar)/);
    // Zorunlu dersler listesi: FF alınan MAT 103E kalmış sayılır, BB alınan FIZ 101E sayılmaz.
    const req = card.locator('details.dp-grad-more').first();
    await req.locator('summary').click();
    await expect(req.locator('[data-jump-code="MAT 103E"]')).toBeVisible();
    await expect(req.locator('[data-jump-code="FIZ 101E"]')).toHaveCount(0);
    // Eksik seçmeliler türe göre gruplanır.
    const el = card.locator('details.dp-grad-more').nth(1);
    await el.locator('summary').click();
    await expect(el).toContainText('Bölüm seçmelileri (MT)');
    await expect(el).toContainText('İnsan ve toplum bilimleri (ITB/SNT)');
    await noHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test('tekrar listesi GANO kazancına göre sıralanır, hedef not değişir, satır planda vurgulanır', async ({ page }) => {
    await open(page, seedA());
    const box = page.locator('#dp-retake');
    await expect(box).toBeVisible();
    await box.locator('summary').click();
    const rows = box.locator('.dp-retake-row');
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText('MAT 103E');
    await expect(rows.nth(1)).toContainText('MAT 104E');
    await expect(rows.nth(2)).toContainText('FIZ 102E');
    // FF → BB, 4 kredi, payda 30,5: +0,39.
    await expect(rows.nth(0).locator('.dp-retake-gain')).toHaveText('+0,39');
    // Hedef CC: FF → CC, 4 kredi: +0,26; üç ders de hâlâ kazanç getirir.
    await page.locator('#dp-retake-target').selectOption('CC');
    await expect(rows.nth(0).locator('.dp-retake-gain')).toHaveText('+0,26');
    await expect(rows).toHaveCount(3);
    await page.locator('#dp-retake-target').selectOption('BB');
    // Satıra tıklayınca plandaki ders görünür ve vurgulanır.
    await rows.nth(1).click();
    const target = page.locator('#dp-semesters .dp-course[data-plan-code="MAT 104E"]');
    await expect(target).toHaveClass(/dp-flash/);
    await expect(target).toBeInViewport();
    await noHorizontalOverflow(page);
  });

  test('akademik durum: sınıf, gözetim eşiği, onur uzaklığı ve kaynak bağlantısı', async ({ page }) => {
    await open(page, seedA());
    const st = page.locator('#dp-standing');
    await expect(st).toBeVisible();
    await expect(st.locator('.dp-st-class')).toContainText('1. sınıf');
    await expect(st.locator('.dp-st-watch')).toContainText('Gözetim eşiği 1,80');
    await expect(st.locator('.dp-st-watch.is-on')).toHaveCount(0);
    await expect(st.locator('.dp-st-honor')).toContainText('Onur 3,00');
    await expect(st.locator('.dp-st-honor')).toContainText('uzak');
    await expect(st.locator('.dp-st-term')).toContainText('2025-2026 Bahar');
    await expect(st.locator('.dp-st-term')).toContainText('18 krediden az');
    await expect(st.locator('a[href*="sis.itu.edu.tr/TR/mevzuat/lisans-yonetmelik"]')).toBeVisible();
  });

  test('gözetim eşiğinin altında kırmızı uyarı, tahmin 18 kredi tavanıyla', async ({ page }) => {
    await open(page, seedB());
    const warn = page.locator('#dp-standing .dp-st-watch.is-on');
    await expect(warn).toBeVisible();
    await expect(warn).toContainText('Gözetim listesi');
    await expect(warn).toContainText('1,80');
    const color = await warn.locator('b').evaluate((el) => getComputedStyle(el).color);
    const red = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--red)';
      document.querySelector('#view-dersplanim').appendChild(probe);
      const c = getComputedStyle(probe).color; probe.remove(); return c;
    });
    expect(color).toBe(red);
    await expect(page.locator('#dp-grad .dp-grad-warn')).toContainText('2,00');
    await noHorizontalOverflow(page);
  });

  test('transkriptteki resmî OBS durumu kaynak kabul edilir, eşik hesabı açıklama olur', async ({ page }) => {
    const seed = seedA();
    seed.transcript.standing = [
      { term: '2025-2026 / Güz', status: 'İyi Durum' },
      { term: '2025-2026 / Bahar', status: 'Gözetim Listesi' },
    ];
    await open(page, seed);
    const warn = page.locator('#dp-standing .dp-st-watch.is-on');
    await expect(warn).toBeVisible();
    await expect(warn).toContainText('Gözetim listesi (OBS, 2025-2026 Bahar)');
    await expect(warn).toContainText('1. sınıf eşiği 1,80');
    await expect(page.locator('#dp-grad .dp-grad-est')).toContainText('gözetimde en fazla 18 kredi');
  });

  test('resmî durum "İyi Durum" ise nötr satır, kırmızı yok', async ({ page }) => {
    const seed = seedA();
    seed.transcript.standing = [{ term: '2025-2026 / Bahar', status: 'İyi Durum' }];
    await open(page, seed);
    await expect(page.locator('#dp-standing .dp-st-official')).toHaveText('OBS akademik durumu (2025-2026 Bahar): İyi Durum');
    await expect(page.locator('#dp-standing .dp-st-watch.is-on')).toHaveCount(0);
  });

  test('mobilde dokunma hedefleri en az 44px', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'yalnız mobil');
    await open(page, seedA());
    await page.locator('#dp-retake summary').click();
    const h = await page.locator('#dp-retake .dp-retake-row').first().evaluate((el) => el.getBoundingClientRect().height);
    expect(h).toBeGreaterThanOrEqual(44);
    const s = await page.locator('#dp-retake-target').evaluate((el) => el.getBoundingClientRect().height);
    expect(s).toBeGreaterThanOrEqual(44);
    const sum = await page.locator('#dp-grad details.dp-grad-more > summary').first().evaluate((el) => el.getBoundingClientRect().height);
    expect(sum).toBeGreaterThanOrEqual(44);
  });
});
