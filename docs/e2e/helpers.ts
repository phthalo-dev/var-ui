import type { Page } from '@playwright/test';
import type { DemoId } from '../src/demos/types';

/**
 * Navigate to a demo in the `/demo` gallery and wait until its island is hydrated.
 * SSR'd islands put the interactive elements in the HTML before React attaches
 * handlers; the island flips `data-demo-hydrated` on `<html>` after mounting
 * (see `src/components/DemoE2D.tsx`).
 */
export async function gotoDemo(
  page: Page,
  id: DemoId,
  params: { direction?: 'rtl'; colorMode?: 'dark' | 'light' } = {},
): Promise<void> {
  const search = new URLSearchParams();
  if (params.direction) search.set('direction', params.direction);
  if (params.colorMode) search.set('colorMode', params.colorMode);
  const query = search.size > 0 ? `?${search}` : '';
  await page.goto(`/demo/${id}${query}`);
  await page.waitForSelector('html[data-demo-hydrated]');
}
