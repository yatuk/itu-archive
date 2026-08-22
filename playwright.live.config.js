import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.LIVE_BASE_URL || 'https://itu-ders.com';

export default defineConfig({
  testDir: './test/live',
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  reporter: [['github'], ['list']],
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'canlı-masaüstü', use: { ...devices['Desktop Chrome'] } },
    { name: 'canlı-mobil', use: { ...devices['Pixel 7'] } },
  ],
});
