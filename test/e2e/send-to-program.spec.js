import { test, expect } from '@playwright/test';

// Yaşanmış hata: Dersler'de seçili şubeler "Programa gönder" ile eski
// 'itu-schedule' kaydına yazılıyordu; Haftalık Program ise 'itu-programs'
// içindeki aktif programı okuduğu için "Eklenen dersler 0" kalıyordu.
test('Dersler: seçili şubeler "Programa gönder" ile aktif programa eklenir', async ({ page }, testInfo) => {
  // Seçim kutuları dar düzende gizli; toplu gönderim masaüstü akışı.
  test.skip(testInfo.project.name === 'mobil', 'seçim kutuları mobilde yok');
  await page.goto('/#dersler');
  const first = page.getByRole('checkbox', { name: 'CRN 10002 şubesini seç' });
  await expect(first).toBeVisible({ timeout: 30000 });
  await first.check();
  await page.getByRole('checkbox', { name: 'CRN 10003 şubesini seç' }).check();
  await page.locator('#sel-send').click();

  await expect(page).toHaveURL(/#program/, { timeout: 15000 });
  await expect(page.locator('#view-program')).toContainText(/Eklenen dersler\s*2/, { timeout: 15000 });
});
