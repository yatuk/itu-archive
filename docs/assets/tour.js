// Rehber tur: Driver.js ile adım adım gezinme. Sürücü yerel vendor/ altında —
// CDN bağımlılığı yok, site çevrimdışı da açılır.
//
// Adımlar sekmeler arası geçiyor; gizli bir eleman vurgulanamaz, bu yüzden
// onHighlightStarted içinde hedef sekme gösterilir (replaceState, geçmişi
// kirletmez) ve ardından sürücü elemanı konumlandırır.

import { driver } from './vendor/driver.mjs';

let showView = null;
export const STEPS = [
  {
    tab: null,
    element: '#statbar',
    popover: {
      title: 'İTÜ Ders Arşivi',
      description: '2016\'dan bugüne dönem dönem ders programı, önşart, sınav ve akademik takvim. Aktif dönem ve son tarama zamanı burada. Tıklayarak ilerleyin.',
      side: 'bottom', align: 'center',
    },
  },
  {
    tab: 'dersler',
    element: '#q',
    popover: {
      title: 'Ders ara',
      description: 'Ders kodu (BLG 102), ad, CRN veya öğretim üyesiyle anında ara. Birden çok kelime AND olarak aranır.',
      side: 'bottom',
    },
  },
  {
    tab: 'dersler',
    element: '.filters',
    popover: {
      title: 'Filtrele',
      description: 'Branş, gün, saat dilimi, seviye ve yöntemle daralt. Aktif filtreler tek tıkla kaldırılabilen çipler olarak üstte görünür.',
      side: 'bottom',
    },
  },
  {
    tab: 'dersler',
    element: '#rows tr',
    popover: {
      title: 'Detay',
      description: 'Bir satıra tıklayınca oturumlar, kontenjan, önşart ve "bu dersi alabilen programlar" açılır.',
      side: 'top',
    },
  },
  {
    tab: 'dersler',
    element: '#tt-toggle',
    popover: {
      title: 'Zaman çizelgesi',
      description: 'Şubeleri seç, "zaman çizelgesi" ile haftalık gün × saat ızgarasında çakışan dersleri gör.',
      side: 'top',
    },
  },
  {
    tab: 'gecmis',
    element: '#hq',
    popover: {
      title: 'Geçmiş',
      description: '27 dönemde bir dersi kim verdi, hangi dönemlerde açıldı, bir hoca hangi dersleri veriyor — burada sor.',
      side: 'bottom',
    },
  },
  {
    tab: 'onsart',
    element: '.pg-program-select',
    popover: {
      title: 'Önşart haritası',
      description: 'Bir bölüm seç: dönem sütunlarında önşart okları. Düz ok zorunlu, kesikli ok alternatif (VEYA) — biri yeter.',
      side: 'bottom',
    },
  },
  {
    tab: 'sinavlar',
    element: '#eq',
    popover: {
      title: 'Sınavlar',
      description: 'Final ve mazeret sınavlarını ders, tür ve binaya göre filtrele.',
      side: 'bottom',
    },
  },
  {
    tab: 'takvim',
    element: '#f-year',
    popover: {
      title: 'Akademik takvim',
      description: 'Yıla göre takvimi gezin, gelecek etkinlikleri gör. İyi keşifler!',
      side: 'bottom',
    },
  },
];

export function initTour(opts) {
  showView = opts && opts.showView;
  const btn = document.querySelector('#tour');
  if (btn) btn.addEventListener('click', start);
}

// İlk ziyarette otomatik başlatır (boot tamamlanınca çağrılır).
export function maybeStartTour() {
  try {
    if (localStorage.getItem('itu-tour-done')) return;
  } catch (e) { return; }
  setTimeout(start, 900);
}

function start() {
  const t = driver({
    animate: true,
    duration: 350,
    showProgress: true,
    progressText: '{{current}} / {{total}}',
    nextBtnText: 'sonraki →',
    prevBtnText: '← önceki',
    doneBtnText: 'tamam',
    overlayColor: '#000000',
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 6,
    popoverClass: 'itu-tour-popover',
    allowClose: true,
    onHighlightStarted: (activeElement, step) => {
      if (step.tab && showView) showView(step.tab, false);
    },
    onDestroyed: () => {
      try { localStorage.setItem('itu-tour-done', '1'); } catch (e) {}
    },
    steps: STEPS,
  });
  t.drive();
}
