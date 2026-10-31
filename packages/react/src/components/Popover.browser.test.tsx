import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { finishAll, raf, settled } from '../test/browser';
import { Dialog } from './Dialog';
import { Popover, type PopoverRootProps } from './Popover';

beforeAll(() => {
  const slow = document.createElement('style');
  slow.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .trigger { position: fixed; top: 200px; left: 200px; }`;
  document.head.append(slow);
});

afterEach(() => {
  document.documentElement.style.overflow = '';
});

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const shown = (el: Element) => el.matches(':popover-open');
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={{}}>{children}</IconProvider>
    </DesignSystemProvider>
  );
}

function TestPopover(props: Partial<PopoverRootProps>) {
  return (
    <Wrap>
      <button data-testid="outside">outside</button>
      <Popover.Root {...props}>
        <Popover.Trigger>
          <button type="button" className="trigger" data-testid="trigger">
            Open
          </button>
        </Popover.Trigger>
        <Popover.Popup data-testid="popup">
          <Popover.Title>Details</Popover.Title>
          <Popover.Content>
            <input data-testid="input" aria-label="Name" />
            <Popover.Close>
              <button type="button" data-testid="close">
                Done
              </button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Popup>
      </Popover.Root>
    </Wrap>
  );
}

describe('open and close sync', () => {
  test('closed by default with no children mounted; a trigger click opens and a second closes (no double toggle)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover onOpenChange={onOpenChange} />);
    expect(shown(q('popup'))).toBe(false);
    expect(q('input')).toBeNull();
    await userEvent.click(q('trigger'));
    await raf();
    expect(shown(q('popup'))).toBe(true);
    expect(q('input')).not.toBeNull();
    expect(reasons(onOpenChange)).toEqual([[true, 'trigger-press']]);
    await userEvent.click(q('trigger'));
    await raf();
    expect(shown(q('popup'))).toBe(false);
    expect(reasons(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'trigger-press'],
    ]);
  });

  test('keeps the element until the exit ends', async () => {
    render(<TestPopover defaultOpen />);
    await settled(q('popup'));
    expect(q('input')).not.toBeNull();
    await userEvent.click(q('close'));
    await raf();
    expect(q('popup')).not.toBeNull();
    await finishAll(q('popup'));
    await raf();
    expect(q('input')).toBeNull();
    expect(shown(q('popup'))).toBe(false);
  });

  test('works in StrictMode', async () => {
    render(
      <StrictMode>
        <TestPopover />
      </StrictMode>,
    );
    await userEvent.click(q('trigger'));
    await raf();
    expect(shown(q('popup'))).toBe(true);
  });

  test('is controlled by `open`; cancel() vetoes the change', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <TestPopover
          open={open}
          onOpenChange={(next, details) => {
            if (!next) details.cancel();
            else setOpen(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(shown(q('popup'))).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    await raf();
    expect(shown(q('popup'))).toBe(true);
  });
});

describe('reasons', () => {
  test('escape-key and outside-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger'));
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange).slice(-1)[0]).toEqual([false, 'escape-key']);

    await userEvent.click(q('trigger'));
    await raf();
    await userEvent.click(q('outside'));
    await raf();
    expect(reasons(onOpenChange).slice(-1)[0]).toEqual([false, 'outside-press']);
  });

  test('Popover.Close reports close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await settled(q('popup'));
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'close-press']]);
  });
});

describe('focus and semantics', () => {
  test('opening does not move focus; closing returns it to the trigger', async () => {
    render(<TestPopover />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(document.activeElement).toBe(q('trigger'));
    await userEvent.click(q('input'));
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(document.activeElement).toBe(q('trigger'));
  });

  test('role=dialog named by the Title; ref and native props reach the popup', async () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Wrap>
        <Popover.Root defaultOpen>
          <Popover.Trigger>
            <button type="button">Open</button>
          </Popover.Trigger>
          <Popover.Popup data-testid="popup" ref={ref} className="mine" placement="top end">
            <Popover.Title>Details</Popover.Title>
          </Popover.Popup>
        </Popover.Root>
      </Wrap>,
    );
    const popup = q('popup');
    expect(ref.current).toBe(popup);
    expect(popup.classList.contains('mine')).toBe(true);
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.getAttribute('aria-labelledby')).toBe(popup.querySelector('h2')!.id);
    expect(popup.getAttribute('data-placement')).toBe('top end');
    expect(popup.getAttribute('popover')).toBe('auto');
  });
});

describe('placement', () => {
  test('opens below the trigger by default and above with placement="top"', async () => {
    const { rerender } = render(<TestPopover defaultOpen />);
    await settled(q('popup'));
    const trg = q('trigger').getBoundingClientRect();
    expect(q('popup').getBoundingClientRect().top).toBeGreaterThanOrEqual(trg.bottom - 1);
    rerender(<div />);
    render(
      <Wrap>
        <Popover.Root defaultOpen>
          <Popover.Trigger>
            <button type="button" className="trigger" data-testid="trigger">
              Open
            </button>
          </Popover.Trigger>
          <Popover.Popup data-testid="popup" placement="top" offset={20}>
            Body
          </Popover.Popup>
        </Popover.Root>
      </Wrap>,
    );
    await settled(q('popup'));
    const t2 = q('trigger').getBoundingClientRect();
    const p2 = q('popup').getBoundingClientRect();
    expect(p2.bottom).toBeLessThanOrEqual(t2.top - 19);
  });
});

describe('inside a modal dialog and nesting', () => {
  test('a popover inside a modal <dialog> opens, is clickable, and Escape closes only the popover first', async () => {
    const dialogChange = vi.fn<OverlayOpenChangeHandler>();
    const popChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <Wrap>
        <Dialog.Root defaultOpen onOpenChange={dialogChange}>
          <Dialog.Popup data-testid="dialog">
            <Dialog.Title>Modal</Dialog.Title>
            <Popover.Root onOpenChange={popChange}>
              <Popover.Trigger>
                <button type="button" data-testid="trigger">
                  Open
                </button>
              </Popover.Trigger>
              <Popover.Popup data-testid="popup" aria-label="Inner">
                <button type="button" data-testid="inner">
                  Inner
                </button>
              </Popover.Popup>
            </Popover.Root>
          </Dialog.Popup>
        </Dialog.Root>
      </Wrap>,
    );
    await settled(q('dialog'));
    await userEvent.click(q('trigger'));
    await raf();
    expect(shown(q('popup'))).toBe(true);
    const rect = q('inner').getBoundingClientRect();
    expect(document.elementFromPoint(rect.x + 2, rect.y + 2)).toBe(q('inner'));
    await userEvent.click(q('inner'));
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(shown(q('popup'))).toBe(false);
    expect((q('dialog') as HTMLDialogElement).open).toBe(true);
    expect(dialogChange).not.toHaveBeenCalled();
    expect(reasons(popChange).slice(-1)[0]).toEqual([false, 'escape-key']);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(dialogChange).toHaveBeenCalled();
  });

  test('two nested popovers: opening/closing the child does not dismiss the parent', async () => {
    const parentChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <Wrap>
        <Popover.Root onOpenChange={parentChange}>
          <Popover.Trigger>
            <button type="button" data-testid="ptrigger">
              Parent
            </button>
          </Popover.Trigger>
          <Popover.Popup data-testid="parent" aria-label="Parent">
            <Popover.Root>
              <Popover.Trigger>
                <button type="button" data-testid="ctrigger">
                  Child
                </button>
              </Popover.Trigger>
              <Popover.Popup data-testid="child" aria-label="Child">
                <button type="button" data-testid="cinner">
                  x
                </button>
              </Popover.Popup>
            </Popover.Root>
          </Popover.Popup>
        </Popover.Root>
      </Wrap>,
    );
    await userEvent.click(q('ptrigger'));
    await raf();
    await userEvent.click(q('ctrigger'));
    await raf();
    expect(shown(q('child'))).toBe(true);
    expect(shown(q('parent'))).toBe(true);
    await userEvent.click(q('cinner'));
    expect(shown(q('parent'))).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(shown(q('child'))).toBe(false);
    expect(shown(q('parent'))).toBe(true);
    expect(reasons(parentChange)).toEqual([[true, 'trigger-press']]);
  });

  test('outside click light-dismisses an auto popover', async () => {
    render(<TestPopover />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(shown(q('popup'))).toBe(true);
    await userEvent.click(q('outside'));
    await raf();
    expect(shown(q('popup'))).toBe(false);
  });
});
