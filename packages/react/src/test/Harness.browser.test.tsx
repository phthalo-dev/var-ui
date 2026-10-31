import { expect, test } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { inTopLayer, raf } from './browser';

// Smoke test for the browser project: real <dialog> top layer and `popover`. Real component
// tests live next to the components as `*.browser.test.tsx`.

test('modal <dialog> is :modal, in the top layer and above a z-indexed sibling', async () => {
  const { getByTestId } = render(
    <>
      <div data-testid="high" style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }} />
      <dialog data-testid="dialog">hello</dialog>
    </>,
  );
  const dialog = getByTestId('dialog') as HTMLDialogElement;
  expect(dialog.matches(':modal')).toBe(false);
  dialog.showModal();
  await raf();
  expect(dialog.open).toBe(true);
  expect(dialog.matches(':modal')).toBe(true);
  expect(inTopLayer(dialog)).toBe(true);
  const rect = dialog.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
  expect(hit).toBe(dialog);
  dialog.close();
  expect(dialog.matches(':modal')).toBe(false);
});

test('popover element toggles :popover-open', async () => {
  const { getByTestId } = render(
    <>
      <button data-testid="trigger" popoverTarget="p">
        open
      </button>
      <div data-testid="pop" id="p" popover="auto">
        content
      </div>
    </>,
  );
  const pop = getByTestId('pop');
  expect(pop.matches(':popover-open')).toBe(false);
  pop.showPopover();
  await raf();
  expect(pop.matches(':popover-open')).toBe(true);
  expect(inTopLayer(pop)).toBe(true);
  pop.hidePopover();
  expect(pop.matches(':popover-open')).toBe(false);
});
