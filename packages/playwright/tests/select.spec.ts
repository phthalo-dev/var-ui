import { expect, test } from '@playwright/test';
import { getSelect } from '../src';

const caseUrl = (name: string) => `/?case=${name}`;

test('opens, selects an option and reports the new value', async ({ page }) => {
  await page.goto(caseUrl('select-default'));
  const select = getSelect(page, { name: 'Region' });

  await select.expectEnabled();
  await select.expectPlaceholder('Pick a region');
  await select.selectOption('EU (Frankfurt)');
  await select.expectValue('EU (Frankfurt)');
});

test('reports the preselected value', async ({ page }) => {
  await page.goto(caseUrl('select-prefilled'));
  const select = getSelect(page, { name: 'Region' });
  await select.expectValue('EU (Frankfurt)');
});

test('exposes option state for composition', async ({ page }) => {
  await page.goto(caseUrl('select-default'));
  const select = getSelect(page, { name: 'Region' });
  await select.open();
  await expect(select.option('US (Virginia)')).toBeDisabled();
  await select.close();
});
