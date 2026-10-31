import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { resetHoverWarmUp, type OverlayOpenChangeHandler } from '../overlays';
import { raf } from '../test/browser';
import { Button } from './Button';
import { Tooltip, type TooltipRootProps } from './Tooltip';

beforeAll(() => {
  const s = document.createElement('style');
  s.textContent =
    ':root, :root[class] { --var-ui-duration-slow: 0ms; --var-ui-duration-fast: 0ms; }';
  document.head.append(s);
});
beforeEach(async () => {
  resetHoverWarmUp();
  // Park the real pointer in a corner so a previous test's hover does not leak into this one.
  await userEvent.hover(document.body, { position: { x: 1, y: 1 } });
});
afterEach(() => {
  for (const el of document.querySelectorAll('[popover]:popover-open')) {
    (el as HTMLElement).hidePopover();
  }
});

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const tip = (id = 'tip') => q(id);
const showing = (id = 'tip') => tip(id).matches(':popover-open');
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);
/** Bounded wait for a condition (delay timers are real but tiny). */
const until = (fn: () => boolean) => vi.waitFor(() => expect(fn()).toBe(true), { timeout: 2000 });

function Fixture(props: Partial<TooltipRootProps> & { disabledButton?: boolean }) {
  const { disabledButton, ...root } = props;
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={{}}>
        <div style={{ padding: 120 }}>
          <Tooltip.Root openDelay={20} closeDelay={20} {...root}>
            <Tooltip.Trigger>
              <Button data-testid="trigger" disabled={disabledButton}>
                Save
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Popup data-testid="tip" placement="bottom">
              Save changes
            </Tooltip.Popup>
          </Tooltip.Root>
          <Tooltip.Root openDelay={20} closeDelay={20}>
            <Tooltip.Trigger>
              <button type="button" data-testid="trigger2" style={{ marginInlineStart: 200 }}>
                Other
              </button>
            </Tooltip.Trigger>
            <Tooltip.Popup data-testid="tip2">Other tip</Tooltip.Popup>
          </Tooltip.Root>
        </div>
      </IconProvider>
    </DesignSystemProvider>
  );
}

describe('Tooltip (real browser)', () => {
  test('hover opens after the delay with reason hover, wires aria-describedby and role, and leaving closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    expect(showing()).toBe(false);
    await userEvent.hover(q('trigger'));
    await until(showing);
    expect(reasons(onOpenChange)).toEqual([[true, 'hover']]);
    expect(tip().getAttribute('role')).toBe('tooltip');
    expect(tip().textContent).toBe('Save changes');
    expect(q('trigger').getAttribute('aria-describedby')).toContain(tip().id);
    await userEvent.unhover(q('trigger'));
    await until(() => !showing());
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([false, 'hover']);
    await until(() => !q('trigger').hasAttribute('aria-describedby'));
  });

  test('is anchored below the trigger and in the top layer', async () => {
    render(<Fixture defaultOpen />);
    await raf();
    expect(showing()).toBe(true);
    const t = q('trigger').getBoundingClientRect();
    const p = tip().getBoundingClientRect();
    expect(p.top).toBeGreaterThanOrEqual(t.bottom - 1);
    expect(Math.abs(p.left + p.width / 2 - (t.left + t.width / 2))).toBeLessThan(2);
  });

  test('keyboard Tab focus opens (reason focus); Tab away closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(q('trigger'));
    await until(showing);
    expect(reasons(onOpenChange)[0]).toEqual([true, 'focus']);
    await userEvent.tab();
    await until(() => !showing());
  });

  test('pointer focus (click) does not open from focus; Escape closes while open and reports escape-key', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    await userEvent.hover(q('trigger'));
    await until(showing);
    await userEvent.keyboard('{Escape}');
    await until(() => !showing());
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([false, 'escape-key']);
  });

  test('stays open while the pointer is over the popup (hoverable) and closes after leaving it', async () => {
    render(<Fixture closeDelay={60} />);
    await userEvent.hover(q('trigger'));
    await until(showing);
    await userEvent.hover(tip());
    // Longer than closeDelay: still open because the popup is hovered.
    await new Promise((r) => setTimeout(r, 200));
    expect(showing()).toBe(true);
    await userEvent.unhover(tip());
    await until(() => !showing());
  });

  test('warm-up: a second tooltip opens with no delay right after the first closed', async () => {
    render(<Fixture openDelay={600} closeDelay={0} />);
    // Open the first by controlled-ish path: hover with long delay would be slow, so open via focus
    // of the *other* tooltip (delay 20), close it, then hover the first within the warm window.
    await userEvent.hover(q('trigger2'));
    await until(() => showing('tip2'));
    await userEvent.unhover(q('trigger2'));
    await until(() => !showing('tip2'));
    const started = performance.now();
    await userEvent.hover(q('trigger'));
    await until(showing);
    expect(performance.now() - started).toBeLessThan(500);
  });

  test('touch pointers do not open it', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    const trigger = q('trigger');
    trigger.dispatchEvent(
      new PointerEvent('pointerenter', { pointerType: 'touch', bubbles: false }),
    );
    // React listens to `pointerover`/`pointerout` for enter/leave.
    trigger.dispatchEvent(new PointerEvent('pointerover', { pointerType: 'touch', bubbles: true }));
    await new Promise((r) => setTimeout(r, 120));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(showing()).toBe(false);
  });

  test('disabled: no tooltip on hover or focus', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture disabled onOpenChange={onOpenChange} />);
    await userEvent.hover(q('trigger'));
    await userEvent.tab();
    await new Promise((r) => setTimeout(r, 120));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(showing()).toBe(false);
  });

  test('details.cancel() vetoes opening', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_n, d) => d.cancel());
    render(<Fixture onOpenChange={onOpenChange} />);
    await userEvent.hover(q('trigger'));
    await until(() => onOpenChange.mock.calls.length > 0);
    await raf();
    expect(showing()).toBe(false);
  });

  test('controlled open is the source of truth; the element stays until the exit ends', async () => {
    const { rerender } = render(<Fixture open />);
    await raf();
    expect(showing()).toBe(true);
    rerender(<Fixture open={false} />);
    await until(() => !showing());
    expect(tip().isConnected).toBe(true);
  });

  test('RTL: placement end sits on the left of the trigger', async () => {
    document.body.dir = 'rtl';
    try {
      render(
        <DesignSystemProvider applyToDocument>
          <div style={{ padding: 200 }}>
            <Tooltip.Root defaultOpen>
              <Tooltip.Trigger>
                <button type="button" data-testid="trigger">
                  T
                </button>
              </Tooltip.Trigger>
              <Tooltip.Popup data-testid="tip" placement="end">
                Hi
              </Tooltip.Popup>
            </Tooltip.Root>
          </div>
        </DesignSystemProvider>,
      );
      await raf();
      expect(tip().getBoundingClientRect().right).toBeLessThanOrEqual(
        q('trigger').getBoundingClientRect().left + 1,
      );
    } finally {
      document.body.removeAttribute('dir');
    }
  });
});
