import { render } from '@testing-library/react';
import { useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { raf, settled, viewport } from '../test/browser';
import { MobileNav, MobileNavProvider, type MobileNavProps } from './MobileNav';

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

function Shell({ children, direction }: { children: React.ReactNode; direction?: 'ltr' | 'rtl' }) {
  return (
    <DesignSystemProvider applyToDocument direction={direction}>
      <IconProvider icons={{}}>{children}</IconProvider>
    </DesignSystemProvider>
  );
}

function Nav(props: Partial<MobileNavProps> & { direction?: 'ltr' | 'rtl' }) {
  const { direction, ...rest } = props;
  return (
    <Shell direction={direction}>
      <MobileNav header="Menu" {...rest}>
        <a href="#a" data-testid="link">
          Dashboard
        </a>
      </MobileNav>
    </Shell>
  );
}

describe('MobileNav on a native dialog', () => {
  test('open prop drives showModal and close; nothing mounted while closed', async () => {
    const { rerender } = render(<Nav open={false} />);
    expect(dlg().open).toBe(false);
    expect(q('link')).toBeNull();
    rerender(<Nav open />);
    await raf();
    expect(modal()).toBe(true);
    expect(q('link')).toBeTruthy();
    rerender(<Nav open={false} />);
    await raf();
    expect(dlg().open).toBe(false);
  });

  test('Escape reports escape-key; the close button reports close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Nav defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(dlg().open).toBe(false);
  });

  test('close button: close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Nav defaultOpen onOpenChange={onOpenChange} closeLabel="Close nav" />);
    await raf();
    await userEvent.click(document.querySelector('button[aria-label="Close nav"]')!);
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'close-press']]);
  });

  test('backdrop click: outside-press, only when dismissable; cancel() vetoes', async () => {
    const a = vi.fn<OverlayOpenChangeHandler>();
    const first = render(<Nav defaultOpen onOpenChange={a} />);
    await raf();
    await userEvent.click(dlg(), { position: { x: dlg().offsetWidth + 20, y: 40 }, force: true });
    await raf();
    expect(reasons(a)).toEqual([[false, 'outside-press']]);
    first.unmount();

    const b = vi.fn<OverlayOpenChangeHandler>();
    const second = render(<Nav defaultOpen dismissable={false} onOpenChange={b} />);
    await raf();
    await userEvent.click(dlg(), { position: { x: dlg().offsetWidth + 20, y: 40 }, force: true });
    await raf();
    expect(b).not.toHaveBeenCalled();
    expect(modal()).toBe(true);
    second.unmount();

    const c = vi.fn<OverlayOpenChangeHandler>((_o, d) => d.cancel());
    render(<Nav defaultOpen onOpenChange={c} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(dlg(), { position: { x: dlg().offsetWidth + 20, y: 40 }, force: true });
    await raf();
    expect(reasons(c)).toEqual([
      [false, 'escape-key'],
      [false, 'outside-press'],
    ]);
    expect(modal()).toBe(true);
  });

  test('scroll lock while open', async () => {
    const { rerender } = render(<Nav open={false} />);
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
    rerender(<Nav open />);
    await raf();
    expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
    rerender(<Nav open={false} />);
    await raf();
    await settled(dlg());
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
  });

  test('exit keeps the element and its children until the slide ends', async () => {
    const { rerender } = render(<Nav open />);
    await raf();
    await settled(dlg());
    rerender(<Nav open={false} />);
    await new Promise((r) => setTimeout(r, 40));
    expect(getComputedStyle(dlg()).display).not.toBe('none');
    expect(q('link')).toBeTruthy();
    await new Promise((r) => setTimeout(r, 300));
    expect(getComputedStyle(dlg()).display).toBe('none');
    expect(q('link')).toBeNull();
  });

  test('side: start docks to the inline-start edge (RTL flips it), end to the other', async () => {
    const ltr = render(<Nav open />);
    await raf();
    await settled(dlg());
    expect(dlg().getAttribute('data-side')).toBe('start');
    expect(dlg().getBoundingClientRect().left).toBeCloseTo(0, 0);
    ltr.unmount();

    const rtl = render(<Nav open direction="rtl" />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right).toBeCloseTo(viewport().right, 0);
    rtl.unmount();

    render(<Nav open side="end" />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right).toBeCloseTo(viewport().right, 0);
  });
});

describe('MobileNavProvider and Toggle', () => {
  function Demo({ onOpenChange }: { onOpenChange?: OverlayOpenChangeHandler }) {
    return (
      <Shell>
        <MobileNavProvider onOpenChange={onOpenChange}>
          <MobileNav.Toggle data-testid="toggle" />
          <MobileNav closeLabel="Close nav">
            <a href="#a" data-testid="link">
              Dashboard
            </a>
          </MobileNav>
        </MobileNavProvider>
      </Shell>
    );
  }

  test('the toggle opens the nav (trigger-press), focus moves in; Escape returns it to the toggle', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Demo onOpenChange={onOpenChange} />);
    expect(q('toggle').getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(q('toggle'));
    await raf();
    expect(modal()).toBe(true);
    expect(q('toggle').getAttribute('aria-expanded')).toBe('true');
    expect(dlg().contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(document.activeElement).toBe(q('toggle'));
    expect(reasons(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'escape-key'],
    ]);
  });

  test('controlled by an explicit open and onClick', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Shell>
          <MobileNav.Toggle open={open} onClick={() => setOpen(true)} data-testid="toggle" />
          <MobileNav open={open} onOpenChange={setOpen}>
            <p>content</p>
          </MobileNav>
        </Shell>
      );
    }
    render(<Controlled />);
    await userEvent.click(q('toggle'));
    await raf();
    expect(modal()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(dlg().open).toBe(false);
    expect(q('toggle').getAttribute('aria-expanded')).toBe('false');
  });
});
