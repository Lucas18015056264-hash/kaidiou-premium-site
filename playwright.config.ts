import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: '../../work/task-6-playwright-results',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    colorScheme: 'dark',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'chromium-mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: 'chromium-tablet',
      use: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: 'npm run test:e2e:server',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
});
