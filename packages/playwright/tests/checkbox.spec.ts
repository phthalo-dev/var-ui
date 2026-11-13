import { test } from '@playwright/test';
import { getCheckbox } from '../src';

const caseUrl = (name: string) => `/?case=${name}`;

test('toggles via the label', async ({ page }) => {
  await page.goto(caseUrl('checkbox-default'));
  const checkbox = getCheckbox(page, { name: 'Email updates' });
  await checkbox.expectUnchecked();
  await checkbox.toggle();
  await checkbox.expectChecked();
  await checkbox.toggle();
  await checkbox.expectUnchecked();
});

test('reports initial checked state', async ({ page }) => {
  await page.goto(caseUrl('checkbox-checked'));
  const checkbox = getCheckbox(page, { name: 'Email updates' });
  await checkbox.expectChecked();
});

test('reports disabled state', async ({ page }) => {
  await page.goto(caseUrl('checkbox-disabled'));
  await getCheckbox(page, { name: 'Email updates' }).expectDisabled();
});
