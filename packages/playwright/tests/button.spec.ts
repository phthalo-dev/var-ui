import { test } from '@playwright/test';
import { getButton } from '../src';

const caseUrl = (name: string) => `/?case=${name}`;

test('finds, clicks and asserts a button by name', async ({ page }) => {
  await page.goto(caseUrl('button-default'));
  const button = getButton(page, { name: 'Run query' });
  await button.expectVisible();
  await button.click();
  await button.expectEnabled();
});

test('picks the right one of several buttons by name', async ({ page }) => {
  await page.goto(caseUrl('buttons-multiple'));
  const save = getButton(page, { name: 'Save draft' });
  await save.expectEnabled();
  await save.click();
  const del = getButton(page, { name: 'Delete' });
  await del.expectDisabled();
});

test('reports the disabled state', async ({ page }) => {
  await page.goto(caseUrl('button-disabled'));
  const button = getButton(page, { name: 'Run query' });
  await button.expectDisabled();
});
