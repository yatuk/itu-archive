// Test yardımcısı (spec değil): mobil kabukta sekme açma.
//
// Sade temada ≤600px'te uygulama sekme çubuğu alt sekme çubuğuna döner ve
// yalnız dört birincil görünümü (Dersler, Program, Müfredat, Önşart) gösterir;
// ikinci görünümler "Daha fazla" sayfasındadır (assets-src/mobile-shell.js).
// Masaüstünde ve fosforda sekme bağlantısı doğrudan tıklanır.

/** `#tab-<sekme>` görünürse tıklar, değilse "Daha fazla" sayfasından açar. */
export async function sekmeyeGit(page, sekme) {
  const dugme = page.locator(`#tab-${sekme}`);
  if (await dugme.isVisible()) {
    await dugme.scrollIntoViewIfNeeded();
    await dugme.click();
    return;
  }
  await page.locator('.mshell-more').click();
  await page.locator(`.mshell-sheet [data-mshell-view="${sekme}"]`).click();
}
