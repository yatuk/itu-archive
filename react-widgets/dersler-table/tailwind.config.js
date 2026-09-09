/** @type {import('tailwindcss').Config} */
export default {
  // Bilinçli olarak "dt-" önekli (Dersler Table): siteye gömülünce sitenin
  // kendi CSS'iyle (assets-src/style.css) sınıf adı çakışması olmasın.
  //
  // Renkler sitenin KENDİ CSS değişkenlerine (assets-src/style.css :root /
  // [data-theme="sade"]) doğrudan işaret eder — ayrı bir tema seti yok.
  // Widget aynı belgeye gömüldüğü için <html data-theme> değiştiğinde
  // otomatik takip eder, iki temayı ayrıca eşitlemeye gerek kalmaz.
  prefix: 'dt-',
  important: '.dersler-table-root',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--hairline)',
        background: 'var(--panel)',
        foreground: 'var(--fg)',
        muted: {
          DEFAULT: 'var(--panel-2)',
          foreground: 'var(--dim)',
        },
        accent: {
          DEFAULT: 'var(--panel-2)',
          foreground: 'var(--acid)',
        },
        primary: {
          DEFAULT: 'var(--acid)',
          foreground: 'var(--on-accent)',
        },
        ring: 'var(--cyan)',
      },
      borderRadius: {
        md: 'calc(var(--radius-card) - 2px)',
        lg: 'var(--radius-card)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        mono: 'var(--mono)',
      },
    },
  },
  plugins: [],
};
