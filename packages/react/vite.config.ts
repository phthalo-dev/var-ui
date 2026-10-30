import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { defineConfig } from 'vite-plus';
import { playwright } from 'vite-plus/test/browser-playwright';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

// Browser tests (`*.browser.test.ts(x)`) run in headless Chromium via Playwright. Fail early with
// an actionable message instead of Playwright's launch error when the browser is not installed.
// (Headless mode uses the chromium-headless-shell build; `playwright install chromium` fetches both.)
// Only checked for test runs so `vp pack` (build, docs and release jobs) needs no browser.
const chromiumPath = chromium.executablePath();
if (process.argv.some((arg) => /[\\/]vitest\.mjs$/.test(arg)) && !existsSync(chromiumPath)) {
  throw new Error(
    `Playwright Chromium is not installed (expected ${chromiumPath}).\n` +
      'Run `pnpm exec playwright install chromium` once, then retry.',
  );
}

export default defineConfig({
  resolve: {
    alias: {
      '@var-ui/core/theme-constants': `${coreSrc}/theme/constants.ts`,
      '@var-ui/core/components': `${coreSrc}/components`,
      '@var-ui/core/shared': `${coreSrc}/shared`,
      '@var-ui/core/tokens': `${coreSrc}/tokens`,
      '@var-ui/core/icons': `${coreSrc}/icons`,
    },
  },
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    // Every emitted module may use hooks/context; mark all as client modules so
    // the package is importable from Next.js app-router server components.
    banner: { js: "'use client';" },
    deps: {
      neverBundle: ['react', 'react-dom', 'react-aria-components', '@var-ui/core', 'typestyles'],
    },
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    projects: [
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/*.browser.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        // Pre-bundle these up front; otherwise Vite re-optimizes on first run and reloads mid-test.
        optimizeDeps: {
          include: [
            'vite-plus/test/browser',
            'react-aria-components',
            'react-dom/client',
            '@testing-library/react',
            'typestyles',
            'typestyles/globals',
          ],
        },
        test: {
          name: 'browser',
          setupFiles: ['./src/test/setup.browser.ts'],
          include: ['src/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
