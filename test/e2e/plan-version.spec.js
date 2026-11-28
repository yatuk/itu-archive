// Müfredat plan sürümü: transkriptin ilk dönemi, öğrencinin tabi olduğu plan
// sürümünü seçer (core/planversions.js). Sentetik metin; gerçek öğrenci verisi
// yok. CEN_LS'nin "2021-2022 / Güz ile 2026-2027/ Güz Dönemleri Arası" sürümü
// (1635) 1. yarıyılda kimya ve lineer cebir içerir; güncel sürüm (2729) içermez.
import { test, expect } from '@playwright/test';
import { sekmeyeGit } from './mobil-kabuk.js';

const TRANSCRIPT = `2023-2024 / Güz Dönemi
Ders Kodu Ders Adı Kredi Not
MAT 281E Linear Algebra and Applicat. 3,00 BB
CEN 113E Intr.toComp.Eng.and Ethics 3,00 AA
KIM 101E General Chemistry I 3,00 CB
KIM 101EL General Chemistry I Lab 1,00 BA
A.Krd. B.Krd. O.K.Krd. B.Puan Ort.
Bilgisayar Mühendisliği (KKTC)
Dönem 10,00 10,00 10,00 31,00 3,10
2024-2025 / Bahar Dönemi
Ders Kodu Ders Adı Kredi Not
MAT 103E Mathematics I 4,00 CC
Toplam 14,00 14,00 14,00 39,00 2,79`;

test.describe('Plan sürümü', () => {
  test('2023 girişli transkript eski sürümü seçer, kimya yuvasına yerleşir, seçim saklanır ve Önşart da kullanır', async ({ page }) => {
    await page.goto('/#dersplanim');
    const open = page.locator('#dp-empty .dp-transcript-open');
    await expect(open).toBeVisible({ timeout: 20000 });
    await open.click();
    await page.locator('#transcript-input').fill(TRANSCRIPT);
    const preview = page.locator('#transcript-preview');
    await expect(preview).toContainText('CEN_LS');
    await expect(preview).toContainText('plan sürümü: 2021-2022 Güz ile 2026-2027 Güz arası, transkriptteki ilk döneme (2023-2024 Güz) göre seçildi');
    await page.locator('.transcript-dlg .dlg-ok').click();

    await expect(page.locator('#dp-prog')).toHaveValue('CEN_LS', { timeout: 20000 });
    await expect(page.locator('#dp-ver')).toHaveValue('1635');
    await expect(page.locator('.dp-grade[data-gcode="KIM 101E"]')).toHaveValue('CB');
    await expect(page.locator('.dp-grade[data-gcode="KIM 101EL"]')).toHaveValue('BA');
    await expect(page.locator('.dp-grade[data-gcode="MAT 281E"]')).toHaveValue('BB');
    await expect(page.locator('.dp-grade[data-gcode="CEN 113E"]')).toHaveValue('AA');
    await expect(page.locator('.dp-grade[data-gcode="MAT 103E"]')).toHaveValue('CC');
    await expect(page.locator('#dp-transcript-result')).toContainText('plan sürümü: 2021-2022 Güz ile 2026-2027 Güz arası');
    // Kimya plana yerleştiği için "plana yerleşmeyen dersler" listesinde yok.
    await expect(page.locator('#dp-unused .dp-unused-code', { hasText: 'KIM 101E' })).toHaveCount(0);

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('itu-grades:v1') || '{}'));
    expect(stored.data.CEN_LS.planVersion).toBe(1635);

    // Yenilemede seçili sürüm ve notlar kalır.
    await page.reload();
    await expect(page.locator('#dp-ver')).toHaveValue('1635', { timeout: 20000 });
    await expect(page.locator('.dp-grade[data-gcode="KIM 101E"]')).toHaveValue('CB');

    // Önşart Haritası aynı program için aynı sürümü gösterir.
    await sekmeyeGit(page, 'onsart');
    await expect(page.locator('.pg-plan-label')).toContainText('2021-2022 / Güz ile 2026-2027', { timeout: 20000 });
    await sekmeyeGit(page, 'dersplanim');
    await expect(page.locator('#dp-prog')).toHaveValue('CEN_LS', { timeout: 20000 });

    // Kullanıcı sürümü yine değiştirebilir: mobilde seçici sayfası, masaüstünde select.
    const card = page.locator('.mshell-prog');
    if (await card.isVisible()) {
      await expect(card.locator('.mshell-prog-d')).toContainText('2021-2022 Güz ile 2026-2027 Güz arası');
      await card.locator('.mshell-prog-change').click();
      const sheet = page.locator('.mshell-sheet');
      await expect(sheet.locator('[data-mshell-set="dp-ver"][aria-checked="true"]')).toHaveAttribute('data-value', '1635');
      await sheet.locator('[data-mshell-set="dp-ver"][data-value="2729"]').click();
      await sheet.locator('.mshell-apply').click();
      await expect(sheet).toBeHidden();
    } else {
      await expect(page.locator('#dp-ver')).toBeVisible();
      await page.locator('#dp-ver').selectOption('2729');
    }
    await expect(page.locator('#dp-ver')).toHaveValue('2729');
    await expect(page.locator('.dp-grade[data-gcode="KIM 101E"]')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('itu-grades:v1') || '{}').data.CEN_LS.planVersion))
      .toBeUndefined();
    // Notlar ders koduyla tutulur: sürüm değişince de kaybolmaz.
    await expect(page.locator('.dp-grade[data-gcode="MAT 103E"]')).toHaveValue('CC');
  });
});
