// Müfredat ve GPA: "Mezuniyete ne kaldı" kartındaki staj satırı. Transkript
// ve notlar sentetiktir; gerçek kişi ya da kurum verisi yoktur.

import { test, expect } from '@playwright/test';

const PROG = 'CEN_LS';

const TRANSCRIPT = `Öğrenci Numarası : 000000000
Adı : TEST KULLANICISI
2026-2027 / Güz Dönemi
Ders Kodu Ders Adı Kredi Not
CEN 101E Intr. to Information Systems 2,00 BB
MAT 103E Mathematics I 4,00 CC
A.Krd. B.Krd. O.K.Krd. B.Puan Ort.
Bilgisayar Mühendisliği (KKTC)
Dönem 6,00 6,00 6,00 14,00 2,33
Toplam 6,00 6,00 6,00 14,00 2,33
Akd. Durum İyi Durum
Staj Bilgileri
Kurum Staj Tarihi Staj Süresi Program
Örnek Yazılım A.Ş. 01.07.2025 - 25.08.2025 20 İş Günü Bilgisayar Mühendisliği (İngilizce) (KKTC)
Lisans
İSTANBUL TEKNİK ÜNİVERSİTESİ
ÖĞRENİM BELGESİ
Sayfa 2 / 2
MUAF 09.03.2026 - 06.04.2026 20 İş Günü Bilgisayar Mühendisliği (İngilizce) (KKTC)
Lisans
** Belge Sonu ** ÖN İZLEME`;

async function noHorizontalOverflow(page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'sayfa yatay taşmamalı').toBeLessThanOrEqual(cw + 1);
}

test.describe('Müfredat ve GPA · staj', () => {
  test('transkriptteki staj bölümü kartta satır olur; kurum adı saklanmaz', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/#dersplanim');
    const open = page.locator('#dp-empty .dp-transcript-open');
    await expect(open).toBeVisible({ timeout: 20000 });
    await open.click();
    await page.locator('#transcript-input').fill(TRANSCRIPT);
    await expect(page.locator('#transcript-preview')).toContainText('2 staj kaydı');
    await expect(page.locator('#transcript-preview')).toContainText('2 kayıt · 2 farklı ders');
    await page.locator('.transcript-dlg .dlg-ok').click();
    await expect(page.locator('#dp-prog')).toHaveValue(PROG, { timeout: 20000 });
    await expect(page.locator('#dp-transcript-result')).toContainText('2 staj kaydı');

    const card = page.locator('#dp-grad');
    await expect(card).toBeVisible();
    const line = card.locator('.dp-grad-staj');
    await expect(line).toContainText('Staj');
    await expect(line).toContainText('40 / 40');
    await expect(line).toContainText('iş günü · tamamlandı');
    await expect(card.locator('.dp-grad-est')).not.toContainText('staj');
    const det = card.locator('#dp-staj');
    await det.locator('summary').click();
    await expect(det.locator('summary')).toContainText('Staj kayıtları (2)');
    const items = det.locator('.dp-staj-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText('01.07.2025 - 25.08.2025');
    await expect(items.nth(0)).toContainText('20 iş günü');
    await expect(items.nth(0).locator('.dp-staj-tag')).toHaveCount(0);
    await expect(items.nth(1).locator('.dp-staj-tag')).toHaveText('muaf');
    await expect(det.locator('a[href*="sis.itu.edu.tr/TR/mevzuat/staj-genel-esaslar"]')).toBeVisible();

    const stored = await page.evaluate(() => localStorage.getItem('itu-grades:v1') || '');
    expect(stored).not.toContain('Örnek Yazılım');
    expect(stored).not.toContain('TEST KULLANICISI');
    expect(stored).not.toContain('000000000');
    expect(JSON.parse(stored).data[PROG].internships).toEqual([
      { days: 20, start: '2025-07-01', end: '2025-08-25', exempt: false, source: 'transcript' },
      { days: 20, start: '2026-03-09', end: '2026-04-06', exempt: true, source: 'transcript' },
    ]);
    await noHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test('staj elle eklenir, gerekli süre düzeltilir, kaldırılır ve geri alınır', async ({ page, isMobile }) => {
    await page.addInitScript((prog) => {
      localStorage.setItem('itu-grades:v1', JSON.stringify({ version: 1, data: { [prog]: { grades: { 'CEN 101E': { grade: 'BB', prev: '' } }, elective: {}, updatedAt: 1 } } }));
    }, PROG);
    await page.goto(`/?prog=${PROG}#dersplanim`);
    await expect(page.locator('#dp-semesters .dp-course').first()).toBeVisible({ timeout: 20000 });
    const card = page.locator('#dp-grad');
    const line = card.locator('.dp-grad-staj');
    await expect(line).toContainText('0 / 40');
    await expect(line).toContainText('40 gün kaldı');
    await expect(card.locator('.dp-grad-est')).toContainText('staj: 40 iş günü eksik');

    const det = card.locator('#dp-staj');
    await det.locator('summary').click();
    await expect(det.locator('.dp-staj-empty')).toBeVisible();
    // Boş gönderim: hata alanın yanında, odak alanda.
    await det.locator('.dp-staj-addbtn').click();
    await expect(page.locator('#dp-staj-err')).toBeVisible();
    await expect(page.locator('#dp-staj-days')).toBeFocused();
    await page.locator('#dp-staj-days').fill('20');
    await page.locator('#dp-staj-start').fill('2026-07-06');
    await page.locator('#dp-staj-end').fill('2026-07-31');
    await page.locator('.dp-staj-addbtn').click();
    await expect(line).toContainText('20 / 40');
    await expect(line).toContainText('20 gün kaldı');
    // Kart yeniden çizilse de ayrıntı açık kalır.
    await expect(card.locator('#dp-staj')).toHaveAttribute('open', '');
    const items = card.locator('.dp-staj-item');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('06.07.2026 - 31.07.2026');
    await expect(items.first()).toContainText('elle eklendi');

    await page.locator('#dp-staj-req').fill('20');
    await page.locator('#dp-staj-req').press('Enter');
    await page.locator('#dp-staj-req').blur();
    await expect(line).toContainText('20 / 20');
    await expect(line).toContainText('tamamlandı');

    if (isMobile) {
      for (const sel of ['.dp-staj-del', '.dp-staj-addbtn', '#dp-staj-days', '#dp-staj-req', '#dp-staj summary']) {
        const h = await card.locator(sel).first().evaluate((el) => el.getBoundingClientRect().height);
        expect(h, sel).toBeGreaterThanOrEqual(44);
      }
    }
    await noHorizontalOverflow(page);
    if (isMobile) {
      for (const width of [375, 430]) {
        await page.setViewportSize({ width, height: 900 });
        await noHorizontalOverflow(page);
        const right = await card.evaluate((el) => el.getBoundingClientRect().right);
        expect(right).toBeLessThanOrEqual(width + 1);
      }
    }

    await card.locator('.dp-staj-del').first().click();
    await expect(line).toContainText('0 / 20');
    await expect(card.locator('.dp-staj-item')).toHaveCount(0);
    await page.locator('.toast-action').click();
    await expect(line).toContainText('20 / 20');
    const stored = await page.evaluate((prog) => JSON.parse(localStorage.getItem('itu-grades:v1')).data[prog], PROG);
    expect(stored.internshipRequired).toBe(20);
    expect(stored.internships).toEqual([{ days: 20, start: '2026-07-06', end: '2026-07-31', exempt: false, source: 'manual' }]);
  });
});
