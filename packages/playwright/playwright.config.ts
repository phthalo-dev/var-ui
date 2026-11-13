import { defineConfig } from '@playwright/test';

/**
 * Component-harness unit tests. The webServer serves the fixture React app
 * (`fixture/`) over the repo-standard `vp dev` (see vite.config.ts for aliases);
 * each test navigates to `/?case=<scenario>` (see fixture/scenarios.tsx).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://localhost:4539',
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'vp dev --port 4539 --strictPort',
    url: 'http://localhost:4539',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium' }],
});
