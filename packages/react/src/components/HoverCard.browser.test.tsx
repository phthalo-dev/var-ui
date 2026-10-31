import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { raf } from '../test/browser';
import { HoverCard, type HoverCardRootProps } from './HoverCard';
import { Link } from './Link';

beforeAll(() => {
  const s = document.createElement('style');
  s.textContent =
    ':root, :root[class] { --var-ui-duration-slow: 0ms; --var-ui-duration-fast: 0ms; }';
  document.head.append(s);
});
beforeEach(async () => {
  await userEvent.hover(document.body, { position: { x: 1, y: 1 } });
});
afterEach(() => {
  for (const el of document.querySelectorAll('[popover]:popover-open')) {
    (el as HTMLElement).hidePopover();
  }
});

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const showing = () => q('card').matches(':popover-open');
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);
const until = (fn: () => boolean) => vi.waitFor(() => expect(fn()).toBe(true), { timeout: 2000 });

function Fixture(props: Partial<HoverCardRootProps>) {
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={{}}>
        <div style={{ padding: 160 }}>
          <HoverCard.Root openDelay={20} closeDelay={40} {...props}>
            <HoverCard.Trigger>
              <Link href="#profile" data-testid="trigger">
                @user
              </Link>
            </HoverCard.Trigger>
            <HoverCard.Popup data-testid="card" placement="bottom">
              <HoverCard.Title>User</HoverCard.Title>
              <HoverCard.Content>
                Preview{' '}
                <Link href="#more" data-testid="inner">
                  more
                </Link>
              </HoverCard.Content>
            </HoverCard.Popup>
          </HoverCard.Root>
          {/* Well clear of the card, whatever the font or scrollbar metrics wrap into. */}
          <button type="button" data-testid="after" style={{ display: 'block', marginTop: 320 }}>
            after
          </button>
        </div>
      </IconProvider>
    </DesignSystemProvider>
  );
}

describe('HoverCard (real browser)', () => {
  test('hover opens (reason hover), names the dialog, sets aria-details, leaving closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    await userEvent.hover(q('trigger'));
    await until(showing);
    expect(reasons(onOpenChange)).toEqual([[true, 'hover']]);
    expect(q('card').getAttribute('role')).toBe('dialog');
    expect(q('card').getAttribute('aria-labelledby')).toBe(q('card').querySelector('h2')!.id);
    expect(q('trigger').getAttribute('aria-details')).toContain(q('card').id);
    await userEvent.unhover(q('trigger'));
    await until(() => !showing());
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([false, 'hover']);
  });

  test('is anchored below the trigger', async () => {
    render(<Fixture defaultOpen />);
    await raf();
    expect(q('card').getBoundingClientRect().top).toBeGreaterThanOrEqual(
      q('trigger').getBoundingClientRect().bottom - 1,
    );
  });

  test('stays open when the pointer moves onto the card, closes after leaving it', async () => {
    render(<Fixture closeDelay={60} />);
    await userEvent.hover(q('trigger'));
    await until(showing);
    await userEvent.hover(q('card'));
    await new Promise((r) => setTimeout(r, 200));
    expect(showing()).toBe(true);
    await userEvent.unhover(q('card'));
    await until(() => !showing());
  });

  test('keyboard: Tab opens (focus), Tab into the card keeps it open, Tab out closes, Escape closes', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(q('trigger'));
    await until(showing);
    expect(reasons(onOpenChange)[0]).toEqual([true, 'focus']);
    // The card is rendered in place after the trigger, so Tab moves into its link.
    await userEvent.tab();
    expect(document.activeElement).toBe(q('inner'));
    await new Promise((r) => setTimeout(r, 120));
    expect(showing()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await until(() => !showing());
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([false, 'escape-key']);
  });

  test('focus leaving to an unrelated element closes it', async () => {
    render(<Fixture />);
    await userEvent.tab();
    await until(showing);
    q('after').focus();
    await until(() => !showing());
  });

  test('touch pointers do not open it', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture onOpenChange={onOpenChange} />);
    q('trigger').dispatchEvent(
      new PointerEvent('pointerover', { pointerType: 'touch', bubbles: true }),
    );
    await new Promise((r) => setTimeout(r, 120));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('disabled: never opens', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture disabled onOpenChange={onOpenChange} />);
    await userEvent.hover(q('trigger'));
    await userEvent.tab();
    await new Promise((r) => setTimeout(r, 120));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(showing()).toBe(false);
  });

  test('outside press closes with reason outside-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Fixture defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('after'));
    await until(() => !showing());
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([
      false,
      'outside-press',
    ]);
  });

  test('details.cancel() on Escape keeps it open', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((open, d) => {
      if (!open) d.cancel();
    });
    render(<Fixture defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([false, 'escape-key']);
    expect(showing()).toBe(true);
  });
});
