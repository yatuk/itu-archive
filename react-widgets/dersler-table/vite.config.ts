import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Çıktı doğrudan docs/assets/react/ altına, sitenin geri kalanıyla aynı
// "build artifact'ı commit'le" kuralına uyacak şekilde yazılır (bkz.
// assets-src/ -> docs/assets/ dönüşümü, cmd/site). ES module formatı
// courses.js'in zaten kullandığı `import()` ile bire bir uyumlu.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  // library mode varsayılan olarak minify'ı kapatır (tüketicinin kendi
  // bundler'ında sıkıştıracağı varsayılır) — burada nihai statik dosya
  // olarak yayınlandığı için hem minify hem NODE_ENV=production açıkça
  // ayarlanmalı, yoksa React'in geliştirme derlemesi (uyarı metinleriyle
  // dolu, çok daha büyük) commit'lenir.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: resolve(__dirname, '../../docs/assets/react'),
    emptyOutDir: true,
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/mount.tsx'),
      formats: ['es'],
      fileName: () => 'dersler-table.js',
    },
  },
});
