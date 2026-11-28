import { test, expect } from '@playwright/test';

// Ctrl/Cmd+K komut paleti ve Dersler listesindeki transkript işaretleri
// ("geçtin" / "tekrar") + "geçtiklerimi gizle" filtresi.

const TERM_URL = '/?term=2025-2026-yaz#dersler';
const rowsOf = (page, code) => page.locator(`#course-groups .cl-body > .cl-item[data-code="${code}"]`);

async function openList(page) {
  await page.goto(TERM_URL);
  await expect(page.locator('#course-groups .cl-body > .cl-item').first()).toBeVisible({ timeout: 20_000 });
}

async function openPalette(page, isMobile) {
  if (isMobile) await page.locator('.cmdk-trigger').click();
  else await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: 'Komut paleti' });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  return { dialog, input };
}

test.describe('Komut paleti', () => {
  test('Ctrl+K açar; kod boşluksuz yazılıp Enter ile ders detayı açılır', async ({ page, isMobile }) => {
    await openList(page);
    const { dialog, input } = await openPalette(page, isMobile);
    await input.fill('mat271');
    const first = dialog.getByRole('option').first();
    await expect(first).toContainText('MAT 271E');
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(input).toHaveAttribute('aria-activedescendant', await first.getAttribute('id'));
    await input.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(page.locator('#detail-panel')).toBeVisible();
    await expect(page).toHaveURL(/#ders\/MAT-271E/);
  });

  test('CRN yazınca o şubeye odaklı detay açılır', async ({ page, isMobile }) => {
    await openList(page);
    const crn = await page.locator('#course-groups .cl-body > .cl-item').first().getAttribute('data-crn');
    const { dialog, input } = await openPalette(page, isMobile);
    await input.fill(crn);
    await expect(dialog.getByRole('group', { name: 'CRN' }).getByRole('option').first()).toContainText(crn);
    await input.press('Enter');
    await expect(page.locator('#detail-panel .d-row.is-focus')).toHaveAttribute('data-crn', crn);
  });

  test('sayfa girdisi sekmeye götürür; ok tuşları ve Esc odağı geri verir', async ({ page, isMobile }) => {
    await openList(page);
    let { dialog, input } = await openPalette(page, isMobile);
    // Boş sorguda sayfalar listelenir; ↓/↑ etkin seçeneği taşır.
    const options = dialog.getByRole('option');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
    await input.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    await input.press('ArrowUp');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');
    await input.press('Escape');
    await expect(dialog).toBeHidden();
    if (isMobile) await expect(page.locator('.cmdk-trigger')).toBeFocused();

    ({ dialog, input } = await openPalette(page, isMobile));
    await input.fill('akademik takvim');
    await expect(dialog.getByRole('group', { name: 'Sayfalar' }).getByRole('option').first()).toContainText('Akademik Takvim');
    await input.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#takvim$/);
    await expect(page.locator('#view-takvim')).toBeVisible();
  });

  test('hoca girdisi Dersler aramasını o hocayla çalıştırır (fare ile)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Fare akışı masaüstünde.');
    await openList(page);
    const instructor = (await page.locator('#course-groups .cl-body > .cl-item .cl-ins a').first().textContent()).trim();
    const { dialog, input } = await openPalette(page, false);
    await input.fill(instructor);
    const opt = dialog.getByRole('group', { name: 'Hocalar' }).getByRole('option').first();
    await expect(opt).toContainText(instructor);
    await opt.click();
    await expect(dialog).toBeHidden();
    // Çok terimli aramada yalnız hoca eşleşmesi sayılmadığından soyadı aranır.
    await expect(page.locator('#q')).toHaveValue(instructor.split(/\s+/).pop());
    await expect(page.locator('#course-groups .cl-body > .cl-item').first().locator('.cl-ins')).toContainText(instructor);
  });
});

test.describe('Transkript işaretleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('itu-grades:v1', JSON.stringify({ version: 1, data: {
        BLG_LS: { updatedAt: 1, grades: { 'MAT 271E': { grade: 'BB', prev: '' }, 'CEV 442E': { grade: 'FF', prev: '' } } },
      } }));
      localStorage.setItem('itu-taken:v1', JSON.stringify({ version: 1, data: { codes: ['MAT 271E', 'CEV 442E', 'ING 112A'], program: 'BLG_LS' } }));
    });
  });

  test('geçilen derste ✓ + harf, FF derste "tekrar" görünür; satır yine detayı açar', async ({ page }) => {
    await openList(page);
    const passed = rowsOf(page, 'MAT 271E').first().locator('.cl-taken.is-passed');
    await expect(passed).toBeVisible();
    await expect(passed).toContainText('✓');
    await expect(passed).toContainText('BB');
    await expect(rowsOf(page, 'CEV 442E').first().locator('.cl-taken.is-retake')).toContainText('tekrar');
    await expect(rowsOf(page, 'ING 112A').first().locator('.cl-taken.is-passed')).toContainText('geçtin');
    // İşaret kontrol değildir: üzerine tıklamak satır tıklaması gibi detayı açar.
    const box = await passed.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator('#detail-panel')).toBeVisible();
    await expect(page).toHaveURL(/#ders\/MAT-271E/);
  });

  test('"geçtiklerimi gizle" geçilen dersleri gizler, tekrarları bırakır', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Filtre kutusu mobilde filtre sayfasında; masaüstünde doğrulanır.');
    await openList(page);
    const toggle = page.getByRole('checkbox', { name: 'geçtiklerimi gizle' });
    await expect(toggle).toBeVisible();
    await expect(rowsOf(page, 'MAT 271E')).not.toHaveCount(0);
    await toggle.check();
    await expect(rowsOf(page, 'MAT 271E')).toHaveCount(0);
    await expect(rowsOf(page, 'ING 112A')).toHaveCount(0);
    await expect(rowsOf(page, 'CEV 442E')).not.toHaveCount(0);
    await expect(page.locator('#chips')).toContainText('geçtiklerimi gizle');
    await toggle.uncheck();
    await expect(rowsOf(page, 'MAT 271E')).not.toHaveCount(0);
  });

  test('işaretler TAKEN_CHANGED ile canlı güncellenir; veri yoksa filtre gizli', async ({ page, isMobile }) => {
    await openList(page);
    await page.evaluate(() => {
      localStorage.removeItem('itu-grades:v1');
      localStorage.removeItem('itu-taken:v1');
      window.dispatchEvent(new CustomEvent('itu:taken-changed'));
    });
    await expect(page.locator('#course-groups .cl-taken')).toHaveCount(0);
    if (!isMobile) await expect(page.getByRole('checkbox', { name: 'geçtiklerimi gizle' })).toBeHidden();
  });
});
