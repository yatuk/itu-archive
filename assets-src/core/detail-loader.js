// Ders detay panelinin (core/course-detail.js + önşart ağacı + css/detail.css)
// tembel giriş noktası. İlk boyamada yüklenmez; ilk açılışta (ya da kullanıcı
// ders listesine dokunduğunda, önceden) çekilir. Diğer sekmelerin gönderdiği
// itu:course-detail olayı modül yüklenmeden de karşılanır.

import { loadStyle } from './lazy-style.js';

let detailModule = null;

export function loadCourseDetail() {
  if (!detailModule) {
    detailModule = Promise.all([import('./course-detail.js'), loadStyle('detail')])
      .then(([mod]) => { mod.initCourseDetail(); return mod; });
    detailModule.catch(() => { detailModule = null; }); // sonraki açılışta yeniden dene
  }
  return detailModule;
}

// Yükleme hatası sessizce yutulmaz ama işlenmemiş söz reddi de bırakmaz.
export function prefetchCourseDetail() {
  loadCourseDetail().catch((error) => console.warn('Ders detayı önceden yüklenemedi:', error));
}

export function openCourseDetail(code, opts) {
  return loadCourseDetail()
    .then((mod) => mod.openCourseDetail(code, opts))
    .catch((error) => console.error('Ders detayı açılamadı:', error));
}

// Önşart, sınavlar, geçmiş ve çizelge blokları paneli bu olayla ister.
export function wireCourseDetailEvents() {
  window.addEventListener('itu:course-detail', (e) => {
    const d = e.detail || {};
    if (d.code) openCourseDetail(d.code, { term: d.term, source: d.source });
  });
}
