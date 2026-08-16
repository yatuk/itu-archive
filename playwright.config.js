import { defineConfig, devices } from '@playwright/test';

// Site tamamen statiktir: docs/ klasörünü olduğu gibi servis edip test ederiz.
// Yayındaki GitHub Pages ile aynı dosyalar — ayrı bir derleme adımı yok.
const PORT = 8799;

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'masaüstü', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobil', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: `python -m http.server ${PORT} --bind 127.0.0.1 --directory docs`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
