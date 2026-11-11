import { expect, test } from '@playwright/test';
import { getDialog } from '../src';

const caseUrl = (name: string) => `/?case=${name}`;

test('opens, shows content and closes through every dismissal path', async ({ page }) => {
  await page.goto(caseUrl('dialog-default'));
  const dialog = getDialog(page, { triggerName: 'Open', title: 'Confirm order' });

  await dialog.expectClosed();
  await dialog.open();
  await dialog.expectOpen();
  await expect(dialog.popup.getByText('You are ordering 2 items.')).toBeVisible();

  await dialog.button('Cancel').click();
  await dialog.expectClosed();
  await dialog.open();
  await dialog.close('escape');
  await dialog.open();
  await dialog.close('backdrop');
});

test('closes through the default Dialog.Close chrome', async ({ page }) => {
  await page.goto(caseUrl('dialog-close-chrome'));
  const dialog = getDialog(page, { triggerName: 'Open', title: 'Settings' });

  await dialog.open();
  await dialog.close('close-button');
});

test('handles the alertdialog variant', async ({ page }) => {
  await page.goto(caseUrl('dialog-alertdialog'));
  const dialog = getDialog(page, { triggerName: 'Remove item', title: 'Remove item?' });

  await dialog.open();
  await dialog.expectOpen();
  await expect(dialog.popup.getByText('This cannot be undone.')).toBeVisible();
  await dialog.button('Cancel').click();
});
