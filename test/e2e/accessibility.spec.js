import { test, expect } from '@playwright/test';

test.describe('Sprint 4 · erişilebilir mobil yüzey', () => {
  for (const width of [320, 390, 430]) {
    test(`${width}px genişlikte ana görevler taşmaz ve 44px dokunma hedefi sunar`, async ({ page }) => {
      await page.setViewportSize({ width, height: 860 });
      await page.goto('/#dersler');
      await expect(page.locator('#course-groups .mobile-course-group')).not.toHaveCount(0, { timeout: 20_000 });

      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll).toBeLessThanOrEqual(overflow.client + 1);

      for (const selector of ['#tab-dersler', '#f-filter-btn', '#mobile-sort', '#tt-toggle', '#csv', '#lang-btn']) {
        const target = page.locator(selector);
        await expect(target).toBeVisible();
        const box = await target.boundingBox();
        expect(box?.height, `${selector} dokunma yüksekliği`).toBeGreaterThanOrEqual(43.9);
      }
    });
  }

  test('mobil filtre paneli odak yönetir, Escape ile kapanır ve odağı geri verir', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#dersler');
    const trigger = page.locator('#f-filter-btn');
    await trigger.click();

    const sheet = page.locator('#filters');
    await expect(sheet).toHaveAttribute('role', 'dialog');
    await expect(sheet).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('#filters-scrim')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.querySelector('#filters')?.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(sheet).not.toHaveClass(/open/);
    await expect(trigger).toBeFocused();
    await expect(page.locator('#filters-scrim')).toBeHidden();
  });

  test('dokunmatik tablet genişliğinde ana kontroller 44px kalır', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Coarse pointer yalnız mobil tarayıcı projesinde doğrulanır.');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#dersler');
    for (const selector of ['#tab-dersler', '#lang-btn', '#f-term', '#tt-toggle']) {
      const box = await page.locator(selector).boundingBox();
      expect(box?.height, `${selector} coarse pointer yüksekliği`).toBeGreaterThanOrEqual(43.9);
    }
  });

  test('sekme listesi ok tuşlarıyla görünür sonraki görünüme geçer', async ({ page }) => {
    await page.goto('/#dersler');
    const courses = page.locator('#tab-dersler');
    await courses.focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.locator('#tab-dersplanim')).toBeFocused();
    await expect(page.locator('#tab-dersplanim')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#view-dersplanim')).toBeVisible();
  });

  test('İngilizce arayüz erişilebilir adları çevirir, ders adını değiştirmez', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?lang=en&term=2025-2026-yaz#dersler');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.brand-home')).toHaveAttribute('aria-label', 'Go to the courses home page');
    await expect(page.locator('#q')).toHaveAttribute('aria-label', 'Search courses');
    await expect(page.locator('#q')).toHaveAttribute('placeholder', 'search course code, name, CRN or instructor…');
    await expect(page.locator('#mobile-sort')).toHaveAttribute('aria-label', 'Sort');

    const firstName = page.locator('.mobile-course-name').first();
    await expect(firstName).not.toBeEmpty({ timeout: 20_000 });
    const archivedName = await firstName.textContent();
    await page.goto('/?lang=tr&term=2025-2026-yaz#dersler');
    await expect(page.locator('.mobile-course-name').first()).toHaveText(archivedName);
  });

  test('yüzde 200 metin ölçeğinde ana içerik yatay taşmaz', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#dersler');
    await page.evaluate(() => { document.body.style.fontSize = '200%'; });
    const layout = await page.evaluate(() => {
      const client = document.documentElement.clientWidth;
      return {
        scroll: document.documentElement.scrollWidth,
        client,
        tabs: (() => {
          const el = document.querySelector('.tabs');
          const rect = el.getBoundingClientRect();
          const css = getComputedStyle(el);
          return `${rect.left}/${rect.right}/${rect.width};${css.width};${css.maxWidth};${css.overflowX}`;
        })(),
        offenders: [...document.querySelectorAll('body *')]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.right > client + 1 || rect.left < -1;
          })
          .slice(0, 8)
          .map((el) => `${el.tagName.toLowerCase()}#${el.id}.${el.className}`),
      };
    });
    const pageScroll = await page.evaluate(() => {
      window.scrollTo(10_000, window.scrollY);
      return window.scrollX;
    });
    expect(pageScroll, `sekmeler ${layout.tabs}; taşan öğeler: ${layout.offenders.join(', ')}`).toBe(0);
    await expect(page.locator('#q')).toBeVisible();
    await expect(page.locator('#f-filter-btn')).toBeVisible();
  });

  test('hareket azaltıldığında hareket kalkar ama durum geçişi korunur', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#dersler');
    const styles = await page.locator('#f-filter-btn').evaluate((el) => {
      const css = getComputedStyle(el);
      return { animation: css.animationName, transition: css.transitionDuration };
    });
    expect(styles.animation).toBe('none');
    expect(styles.transition).toContain('0.08s');
  });
});
