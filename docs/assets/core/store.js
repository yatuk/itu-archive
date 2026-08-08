// Ortak durum (singleton). Görünümler buradan okur/yazar; app.js başlatmayı ve
// sekme yönlendirmesini yönetir. Bu boyutta bir statik site için basit bir
// store yeterli — framework gerekmez.
export const state = {
  index: null,
  termSlug: null,
  rows: [],        // aktif dönemin arama indeksi
  meta: null,      // aktif dönemin meta.json'ı
  filtered: [],
  shown: 0,
  calendar: null,
  exams: null,
  examHay: [],
  hist: null,      // {codes, names} arama listeleri
  quota: null,     // aktif dönemin dolma özeti, CRN -> kayıt
  sort: { key: 'crn', dir: 1 },
};
