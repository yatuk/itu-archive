import { test, expect } from '@playwright/test';

// Dersler listesi: tüm satır tıklanır, j/k + Enter ile klavyeden gezinilir,
// CRN tıklayınca kopyalanır (satır açılmaz), panelde bölüm atlama çubuğu var.

const firstRow = (page) => page.locator('#course-groups .cl-body > .cl-item').first();

async function openList(page) {
  await page.goto('/?term=2025-2026-yaz#dersler');
  await expect(firstRow(page)).toBeVisible({ timeout: 20_000 });
}

test.describe('Dersler satır etkileşimi', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Fare ve klavye akışı masaüstü projesinde doğrulanır.');
  });

  test('ad dışındaki bir hücreye tıklamak detayı açar', async ({ page }) => {
    await openList(page);
    const row = firstRow(page);
    const crn = await row.getAttribute('data-crn');
    // Saat hücresinin ortasına satırın kendisi üzerinden tıklanır.
    const [rowBox, cellBox] = await Promise.all([row.boundingBox(), row.locator('.cl-when').boundingBox()]);
    await row.click({ position: { x: cellBox.x - rowBox.x + cellBox.width / 2, y: rowBox.height / 2 } });
    const panel = page.locator('#detail-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('.d-row.is-focus')).toHaveAttribute('data-crn', crn);
    await expect(row).toHaveClass(/\bis-current\b/);
    // Liste daralır, panel üstüne binmez.
    await expect(panel).toHaveClass(/\bis-docked\b/);
    const [listBox, panelBox] = await Promise.all([page.locator('.course-list-col').boundingBox(), panel.boundingBox()]);
    expect(panelBox.x).toBeGreaterThanOrEqual(listBox.x + listBox.width - 1);
  });

  test('j ile satıra gelinir, Enter detayı açar, panel açıkken j sonraki şubeye geçer, Esc odağı geri verir', async ({ page }) => {
    await openList(page);
    await page.evaluate(() => document.activeElement?.blur());
    const rows = page.locator('#course-groups .cl-body > .cl-item');
    await page.keyboard.press('j');
    await expect(rows.nth(0).locator('.cl-open')).toBeFocused();
    await page.keyboard.press('j');
    await expect(rows.nth(1).locator('.cl-open')).toBeFocused();
    await page.keyboard.press('k');
    await expect(rows.nth(0).locator('.cl-open')).toBeFocused();
    await page.keyboard.press('j');

    const second = rows.nth(1);
    const crn2 = await second.getAttribute('data-crn');
    await page.keyboard.press('Enter');
    const panel = page.locator('#detail-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('.d-row.is-focus')).toHaveAttribute('data-crn', crn2);
    await expect(second).toHaveClass(/\bis-current\b/);

    // Panel kapanmadan bir sonraki şube.
    const third = rows.nth(2);
    const crn3 = await third.getAttribute('data-crn');
    await page.keyboard.press('j');
    await expect(third).toHaveClass(/\bis-current\b/);
    await expect(panel).toBeVisible();
    await expect(panel.locator('.d-row.is-focus')).toHaveAttribute('data-crn', crn3);
    await page.keyboard.press('ArrowUp');
    await expect(second).toHaveClass(/\bis-current\b/);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(second.locator('.cl-open')).toBeFocused();
  });

  test('"/" arama kutusuna odaklanır; arama kutusundayken j yazı olarak kalır', async ({ page }) => {
    await openList(page);
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press('/');
    await expect(page.locator('#q')).toBeFocused();
    await page.keyboard.type('j');
    await expect(page.locator('#q')).toHaveValue('j');
    await expect(page.locator('#detail-panel')).toBeHidden();
  });

  test('CRN düğmesi kopyalar ve satırı açmaz', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openList(page);
    const row = firstRow(page);
    const crn = await row.getAttribute('data-crn');
    await row.locator('.cl-copy').click();
    await expect(page.locator('.toast').last()).toHaveText('CRN kopyalandı');
    await expect(page.locator('#detail-panel')).toBeHidden();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(crn);
  });

  test('satır üzerine gelince "+ Programa ekle" belirir ve şubeyi ekler', async ({ page }) => {
    await openList(page);
    const row = firstRow(page);
    const add = row.locator('.cl-add');
    const strip = row.locator('.cl-act');
    await expect(strip).toHaveCSS('opacity', '0');
    await row.hover();
    await expect(strip).toHaveCSS('opacity', '1');
    await expect(add).toHaveAttribute('aria-pressed', 'false');
    await add.click();
    await expect(add).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#detail-panel')).toBeHidden();
  });

  test('panelde bölüm atlama çubuğu ilgili bölüme kaydırır ve işaretler', async ({ page }) => {
    await page.goto('/?term=2025-2026-yaz#ders/MAT-271E');
    const panel = page.locator('#detail-panel');
    const jump = panel.locator('.d-jump [data-jump]');
    await expect(jump.first()).toBeVisible();
    expect(await jump.count()).toBeGreaterThanOrEqual(3);
    await expect(panel.locator('.d-jump [data-jump="secs"]')).toHaveAttribute('aria-current', 'true');
    await panel.locator('.d-jump [data-jump="hist"]').click();
    await expect(panel.locator('.d-jump [data-jump="hist"]')).toHaveAttribute('aria-current', 'true');
    const gap = await panel.evaluate((el) => {
      const head = el.querySelector('.d-ph').getBoundingClientRect().bottom;
      const hist = el.querySelector('.d-blk-hist').getBoundingClientRect().top;
      return hist - head;
    });
    expect(Math.abs(gap)).toBeLessThan(40);
  });
});

test.describe('Ders detayı telefonda', () => {
  test('alttan sayfa: kapatma düğmesi görünür, yatay taşma yok', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openList(page);
    await firstRow(page).locator('.cl-open').click();
    const panel = page.locator('#detail-panel');
    await expect(panel).toBeVisible();
    await expect(page.locator('#detail-close')).toBeVisible();
    // Alttan kayma animasyonu bitsin.
    await panel.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
    const m = await page.evaluate(() => {
      const p = document.querySelector('#detail-panel');
      return {
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        panel: p.scrollWidth - p.clientWidth,
        bottom: p.getBoundingClientRect().bottom,
        vh: window.innerHeight,
      };
    });
    expect(m.doc).toBeLessThanOrEqual(1);
    expect(m.panel).toBeLessThanOrEqual(1);
    expect(m.bottom).toBeLessThanOrEqual(m.vh + 1);
    await page.locator('#detail-close').click();
    await expect(panel).toBeHidden();
  });
});
