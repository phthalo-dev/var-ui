import { defineConfig } from '@playwright/test';

/**
 * Docs-site demo suite (docs/e2e). The webServer serves the Astro dev server; the smoke
 * spec derives its test list from the demo registry (src/demos/reactDemoMap), so a demo
 * that renders uncleanly fails with its id.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm exec astro dev --port 4321 --host localhost',
    url: 'http://localhost:4321/demo/button.default',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium' }],
});
