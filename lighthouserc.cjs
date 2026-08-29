module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/gano-hesaplama/',
        'http://127.0.0.1:4173/ders-programi-olustur/',
      ],
      // Tek koşu, paylaşımlı Actions runner'ının CPU gürültüsüne karşı savunmasız
      // (LCP/TBT bütçesi son günlerde ~%3-7 marjla art arda kırmızıydı — gerçek
      // bir regresyon değil, runner varyansı). 3 koşunun temsili (medyan) sonucu
      // kullanılır, tek kötü örneklem artık koca gate'i kırmaz.
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 600 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 420000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 180000 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
