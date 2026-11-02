import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vite-plus/test';
import { raf } from '../test/browser';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { resetHoverWarmUp, useHoverIntent } from './useHoverIntent';
import { OverlayTrigger } from './OverlayTrigger';
import { isPopoverShowing, usePopoverElement } from './usePopoverElement';
import { useOverlayRoot } from './useOverlayRoot';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `
    [popover].tip{position:fixed;inset:auto;margin:0;width:120px;height:40px;padding:0;border:0;background:#222;color:#fff}
  `;
  document.head.append(style);
});

beforeEach(() => resetHoverWarmUp());
afterEach(() => {
  for (const el of document.querySelectorAll('[popover]:popover-open')) {
    (el as HTMLElement).hidePopover();
  }
});

function Tip({
  id,
  top,
  openDelay = 300,
  closeDelay = 150,
  onOpenChange,
  warmUp = true,
}: {
  id: string;
  top: number;
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: OverlayOpenChangeHandler;
  warmUp?: boolean;
}) {
  const root = useOverlayRoot({ onOpenChange });
  const pop = usePopoverElement(root, { mode: 'hint' });
  const intent = useHoverIntent(root, { openDelay, closeDelay, warmUp });
  return (
    <>
      <OverlayTrigger root={root} relation="describedby" {...intent.triggerProps}>
        <button
          type="button"
          data-testid={`t-${id}`}
          style={{ position: 'absolute', top, left: 20 }}
        >
          {id}
        </button>
      </OverlayTrigger>
      <div
        {...pop.props}
        {...intent.popupProps}
        ref={pop.ref}
        data-testid={`p-${id}`}
        className="tip"
        // Right under the trigger so the pointer can travel straight onto it.
        style={{ top: top + 28, left: 20 }}
      >
        {pop.mounted ? 'tip ' + id : null}
      </div>
    </>
  );
}

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const showing = (id: string) => isPopoverShowing(q(`p-${id}`));
const calls = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

describe('hover and focus', () => {
  test('hover opens after the delay with reason hover, sets aria-describedby, and leaving closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <Tip
        id="a"
        top={100}
        openDelay={40}
        closeDelay={40}
        onOpenChange={onOpenChange}
        warmUp={false}
      />,
    );
    await userEvent.hover(q('t-a'));
    expect(showing('a')).toBe(false);
    await vi.waitFor(() => expect(showing('a')).toBe(true));
    expect(q('t-a').getAttribute('aria-describedby')).toBe(q('p-a').id);
    await userEvent.unhover(q('t-a'));
    await vi.waitFor(() => expect(showing('a')).toBe(false));
    expect(q('t-a').hasAttribute('aria-describedby')).toBe(false);
    expect(calls(onOpenChange)).toEqual([
      [true, 'hover'],
      [false, 'hover'],
    ]);
  });

  test('the popup is hoverable: moving onto it keeps it open, leaving it closes', async () => {
    render(<Tip id="a" top={100} openDelay={20} closeDelay={150} warmUp={false} />);
    await userEvent.hover(q('t-a'));
    await vi.waitFor(() => expect(showing('a')).toBe(true));
    await userEvent.hover(q('p-a'));
    // Longer than the close delay: it would have closed if the popup did not retain it.
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(showing('a')).toBe(true);
    await userEvent.unhover(q('p-a'));
    await vi.waitFor(() => expect(showing('a')).toBe(false));
  });

  test('keyboard focus opens (focus-visible, reason focus) and blur closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <Tip
        id="a"
        top={100}
        openDelay={20}
        closeDelay={20}
        onOpenChange={onOpenChange}
        warmUp={false}
      />,
    );
    await userEvent.tab();
    expect(document.activeElement).toBe(q('t-a'));
    await vi.waitFor(() => expect(showing('a')).toBe(true));
    await userEvent.tab();
    await vi.waitFor(() => expect(showing('a')).toBe(false));
    expect(calls(onOpenChange)).toEqual([
      [true, 'focus'],
      [false, 'focus'],
    ]);
  });

  test('Escape closes while open (escape-key)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Tip id="a" top={100} openDelay={20} onOpenChange={onOpenChange} warmUp={false} />);
    await userEvent.hover(q('t-a'));
    await vi.waitFor(() => expect(showing('a')).toBe(true));
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(showing('a')).toBe(false);
    expect(calls(onOpenChange)).toEqual([
      [true, 'hover'],
      [false, 'escape-key'],
    ]);
  });
});

describe('warm-up', () => {
  test('a second tooltip opens with no delay right after another closed; a cold one waits', async () => {
    render(
      <>
        <Tip id="a" top={100} openDelay={400} closeDelay={10} />
        <Tip id="b" top={300} openDelay={400} closeDelay={10} />
      </>,
    );
    await userEvent.hover(q('t-a'));
    expect(showing('a')).toBe(false); // cold: the full delay applies
    await vi.waitFor(() => expect(showing('a')).toBe(true), { timeout: 2000 });
    await userEvent.hover(q('t-b'));
    // a is still open or just closed: b opens synchronously with the pointer, no 400ms wait.
    await raf();
    expect(showing('b')).toBe(true);
  });
});

describe('inside a modal dialog', () => {
  test('Escape closes the tooltip and not the dialog', async () => {
    render(
      <dialog data-testid="dlg" style={{ width: 300, height: 400 }}>
        <Tip id="a" top={100} openDelay={20} warmUp={false} />
      </dialog>,
    );
    const dialog = q('dlg') as HTMLDialogElement;
    dialog.showModal();
    await userEvent.hover(q('t-a'));
    await vi.waitFor(() => expect(showing('a')).toBe(true));
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(showing('a')).toBe(false);
    expect(dialog.open).toBe(true);
  });
});
