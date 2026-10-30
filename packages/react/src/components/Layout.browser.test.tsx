import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { raf, settled, viewport } from '../test/browser';
import { Layout, LayoutContent, LayoutPanel } from './Layout';

beforeAll(() => {
  const slow = document.createElement('style');
  slow.textContent = ':root, :root[class] { --var-ui-duration-slow: 150ms; }';
  document.head.append(slow);
});

afterEach(() => {
  document.documentElement.style.overflow = '';
});

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const dlg = () => document.querySelector('dialog') as HTMLDialogElement;
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);
const modal = () => dlg().matches(':modal');

// The browser viewport is 414px wide, so a `below: 'lg'` panel is in its responsive mode.
function Page({
  open,
  defaultOpen,
  onOpenChange,
  side = 'start',
  direction,
  mode = 'overlay',
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  side?: 'start' | 'end';
  direction?: 'ltr' | 'rtl';
  mode?: 'overlay' | 'hidden';
}) {
  const panel = (
    <LayoutPanel
      responsive={{ below: 'lg', mode }}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      label="Details"
      data-testid="panel"
    >
      <button type="button" data-testid="inside">
        Inside
      </button>
    </LayoutPanel>
  );
  return (
    <DesignSystemProvider applyToDocument direction={direction}>
      <button type="button" data-testid="before">
        before
      </button>
      <Layout {...(side === 'start' ? { start: panel } : { end: panel })}>
        <LayoutContent>content</LayoutContent>
      </Layout>
    </DesignSystemProvider>
  );
}

describe('LayoutPanel overlay mode on a native dialog', () => {
  test('open prop drives the modal; the panel body sits inside the dialog; labelled', async () => {
    const { rerender } = render(<Page open={false} />);
    expect(dlg().open).toBe(false);
    expect(q('inside')).toBeNull();
    rerender(<Page open />);
    await raf();
    expect(modal()).toBe(true);
    expect(dlg().contains(q('inside'))).toBe(true);
    expect(dlg().getAttribute('aria-label')).toBe('Details');
    rerender(<Page open={false} />);
    await raf();
    expect(dlg().open).toBe(false);
  });

  test('Escape reports escape-key and closes an uncontrolled panel', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Page defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(dlg().open).toBe(false);
  });

  test('backdrop click reports outside-press; cancel() keeps it open', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_o, d) => d.cancel());
    render(<Page defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(dlg(), { position: { x: dlg().offsetWidth + 20, y: 40 }, force: true });
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'outside-press']]);
    expect(modal()).toBe(true);
  });

  test('focus moves in; scroll is locked while open; exit keeps the element until it ends', async () => {
    render(<Page defaultOpen />);
    await raf();
    await settled(dlg());
    expect(dlg().contains(document.activeElement)).toBe(true);
    expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    await new Promise((r) => setTimeout(r, 40));
    expect(getComputedStyle(dlg()).display).not.toBe('none');
    expect(q('inside')).toBeTruthy();
    await new Promise((r) => setTimeout(r, 300));
    expect(q('inside')).toBeNull();
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
  });

  test('data-side docks the sheet; RTL flips it', async () => {
    const a = render(<Page defaultOpen />);
    await raf();
    await settled(dlg());
    expect(dlg().getAttribute('data-side')).toBe('start');
    expect(dlg().getBoundingClientRect().left).toBeCloseTo(0, 0);
    a.unmount();
    const b = render(<Page defaultOpen direction="rtl" />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right).toBeCloseTo(viewport().right, 0);
    b.unmount();
    render(<Page defaultOpen side="end" />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right).toBeCloseTo(viewport().right, 0);
  });

  test("responsive='hidden' is not an overlay: no dialog", async () => {
    render(<Page open mode="hidden" />);
    await raf();
    expect(document.querySelector('dialog')).toBeNull();
    expect(q('inside')).toBeTruthy();
  });
});
