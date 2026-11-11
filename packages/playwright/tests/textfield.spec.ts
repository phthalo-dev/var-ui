import { test } from '@playwright/test';
import { getTextField } from '../src';

const caseUrl = (name: string) => `/?case=${name}`;

test('fills and reads back the value', async ({ page }) => {
  await page.goto(caseUrl('textfield-default'));
  const field = getTextField(page, { name: 'Project name' });
  await field.fill('Apollo');
  await field.expectValue('Apollo');
  await field.clear();
  await field.expectValue('');
});

test('reports the error state and message', async ({ page }) => {
  await page.goto(caseUrl('textfield-error'));
  const field = getTextField(page, { name: 'Project name' });
  await field.expectInvalid();
  await field.expectErrorText('A project name is required.');
});

test('reports disabled state', async ({ page }) => {
  await page.goto(caseUrl('textfield-disabled'));
  const field = getTextField(page, { name: 'Project name' });
  await field.expectDisabled();
});
