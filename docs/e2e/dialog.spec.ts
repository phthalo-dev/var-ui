import { expect, test } from '@playwright/test';
import { getDialog } from '@var-ui/playwright';
import { gotoDemo } from './helpers';

/**
 * Exemplar of the harness-driven interactive layer over docs demos: the same
 * `@var-ui/playwright` API consumers use, pointed at the real demo islands.
 */
test('docs demo dialog opens and closes', async ({ page }) => {
  await gotoDemo(page, 'dialog.default');
  const dialog = getDialog(page, { triggerName: 'Open dialog', title: 'Notifications' });

  await dialog.open();
  await expect(dialog.popup).toContainText('You are all caught up.');
  await dialog.close('escape');

  await dialog.open();
  await dialog.close('close-button');
});
