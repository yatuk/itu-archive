// Sekmeye özgü CSS parçalarını ihtiyaç anında yükler.
//
// İlk boyamada yalnız css/app.css (kabuk, Dersler ve paylaşılan bileşenler)
// gelir; diğer sekmelerin kuralları cmd/site tarafından assets-src/style.css'ten
// css/<ad>.css dosyalarına ayrılır. Görünüm, parçası yüklenmeden gösterilmez:
// loadStyle'ın sözü <link> yüklendiğinde (ya da hata/zaman aşımında, görünüm
// takılı kalmasın diye) çözülür. Adresler new URL(..., import.meta.url) ile
// verilir; cmd/site her birine dosyanın kendi ?v= sürümünü işler.

const STYLE_URLS = {
  detail: new URL('../css/detail.css', import.meta.url).href,
  dersplanim: new URL('../css/dersplanim.css', import.meta.url).href,
  onsart: new URL('../css/onsart.css', import.meta.url).href,
  program: new URL('../css/program.css', import.meta.url).href,
  takvim: new URL('../css/takvim.css', import.meta.url).href,
  sinavlar: new URL('../css/sinavlar.css', import.meta.url).href,
  gecmis: new URL('../css/gecmis.css', import.meta.url).href,
  donemler: new URL('../css/donemler.css', import.meta.url).href,
  hakkinda: new URL('../css/hakkinda.css', import.meta.url).href,
};

// Bağlantı hiç yanıt vermezse görünüm en geç bu süre sonra açılır.
const STYLE_TIMEOUT_MS = 8000;

const pending = new Map();

export function loadStyle(name) {
  const href = STYLE_URLS[name];
  if (!href || typeof document === 'undefined') return Promise.resolve();
  if (pending.has(name)) return pending.get(name);
  const promise = new Promise((resolve) => {
    let timer = 0;
    const done = () => { clearTimeout(timer); resolve(); };
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.style = name;
    link.addEventListener('load', done, { once: true });
    link.addEventListener('error', done, { once: true });
    timer = setTimeout(done, STYLE_TIMEOUT_MS);
    // Kaskat sırası: parça, çekirdek CSS'in (ve önceki parçaların) hemen
    // ardına girer — sonradan eklenen <style> etiketlerinin (React
    // bileşenlerinin kendi CSS'i) önüne. Tam style.css'teki sıra budur.
    const anchors = document.querySelectorAll('link[data-style], link[rel="stylesheet"][href*="css/app.css"]');
    const anchor = anchors[anchors.length - 1];
    if (anchor) anchor.after(link);
    else document.head.appendChild(link);
  });
  pending.set(name, promise);
  return promise;
}
