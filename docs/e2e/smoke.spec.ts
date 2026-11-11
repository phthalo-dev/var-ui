import { expect, test } from '@playwright/test';
import { DEMO_IDS } from '../src/demos/demoIds';

/**
 * Auto-derived from the demo-id checklist (docs/src/demos/demoIds.ts, compile-guarded
 * against the `DemoId` union): every docs demo must mount in the `/e2d` gallery without
 * errors. A new demo gets a test the moment its id is added to the checklist.
 */
for (const id of DEMO_IDS) {
  test(`docs demo ${id} renders without errors`, async ({ page }) => {
    const problems: string[] = [];
    page.on('pageerror', (error) => problems.push(`pageerror: ${error}`));
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console.error: ${message.text()}`);
    });

    await page.goto(`/e2d/${id}`);
    // The island mounted: the providers render content inside the gallery host.
    await expect(page.locator('[data-e2d-demo] > *')).not.toHaveCount(0);
    expect(problems, `${id} should render without console errors`).toEqual([]);
  });
}
