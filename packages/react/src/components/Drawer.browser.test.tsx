import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import {
  edgeInfo,
  raf,
  settled,
  viewport,
  clickBackdrop as sharedClickBackdrop,
} from '../test/browser';
import { Button } from './Button';
import { Drawer, type DrawerPopupProps, type DrawerRootProps } from './Drawer';

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

function TestDrawer(
  props: Partial<DrawerRootProps> & {
    popup?: Partial<DrawerPopupProps>;
    direction?: 'ltr' | 'rtl';
  },
) {
  const { popup, direction, ...root } = props;
  return (
    <DesignSystemProvider applyToDocument direction={direction}>
      <IconProvider icons={{}}>
        <button data-testid="before">before</button>
        <Drawer.Root {...root}>
          <Drawer.Trigger>
            <button type="button" data-testid="trigger">
              Open
            </button>
          </Drawer.Trigger>
          <Drawer.Popup data-testid="popup" {...popup}>
            <Drawer.Header>
              <Drawer.Title>Settings</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <input data-testid="input" aria-label="Name" />
            </Drawer.Body>
            <Drawer.Close>
              <button type="button" data-testid="close">
                Done
              </button>
            </Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>
        <button data-testid="after">after</button>
      </IconProvider>
    </DesignSystemProvider>
  );
}

function Controlled({
  keepOpen = false,
  onOpenChange,
  ...rest
}: Partial<DrawerRootProps> & { keepOpen?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <TestDrawer
      {...rest}
      open={open}
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!keepOpen) setOpen(next);
      }}
    />
  );
}

/** A point on the backdrop: well left of an end drawer, above a start one. */
const clickBackdrop = () => sharedClickBackdrop(dlg());

describe('open and close sync', () => {
  test('closed by default; the trigger opens a real modal', async () => {
    render(<TestDrawer />);
    expect(dlg().open).toBe(false);
    expect(q('input')).toBeNull();
    await userEvent.click(q('trigger'));
    await raf();
    expect(modal()).toBe(true);
    expect(q('input')).toBeTruthy();
    expect(q('trigger').getAttribute('aria-expanded')).toBe('true');
  });

  test('defaultOpen, StrictMode: a single modal', async () => {
    render(
      <StrictMode>
        <TestDrawer defaultOpen />
      </StrictMode>,
    );
    await raf();
    expect(document.querySelectorAll('dialog:modal')).toHaveLength(1);
  });

  test('controlled open follows the prop both ways without reporting', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(<TestDrawer open={false} onOpenChange={onOpenChange} />);
    rerender(<TestDrawer open onOpenChange={onOpenChange} />);
    await raf();
    expect(modal()).toBe(true);
    rerender(<TestDrawer open={false} onOpenChange={onOpenChange} />);
    await raf();
    expect(dlg().open).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('Close closes it; the dialog is labelled by the title', async () => {
    render(<TestDrawer defaultOpen />);
    await raf();
    const labelledBy = dlg().getAttribute('aria-labelledby')!;
    expect(document.getElementById(labelledBy)?.textContent).toBe('Settings');
    await userEvent.click(q('close'));
    await raf();
    expect(dlg().open).toBe(false);
  });
});

describe('reasons, Escape, backdrop, veto', () => {
  test('Escape: escape-key', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDrawer defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(dlg().open).toBe(false);
  });

  test('trigger press and Close report trigger-press and close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDrawer onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger'));
    await raf();
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'close-press'],
    ]);
  });

  test('backdrop click: outside-press only when dismissable', async () => {
    const a = vi.fn<OverlayOpenChangeHandler>();
    const first = render(<TestDrawer defaultOpen onOpenChange={a} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(reasons(a)).toEqual([[false, 'outside-press']]);
    expect(dlg().open).toBe(false);
    first.unmount();

    const b = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDrawer defaultOpen dismissable={false} onOpenChange={b} />);
    await raf();
    await clickBackdrop();
    await raf();
    expect(b).not.toHaveBeenCalled();
    expect(modal()).toBe(true);
  });

  test('a press inside the drawer is not an outside press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDrawer defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('input'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('imperative: requestClose() from outside our code', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDrawer defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    dlg().requestClose();
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'imperative']]);
  });

  test('details.cancel() vetoes Escape, backdrop and Close', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_o, d) => d.cancel());
    render(<TestDrawer defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await clickBackdrop();
    await userEvent.click(q('close'));
    await raf();
    expect(reasons(onOpenChange)).toEqual([
      [false, 'escape-key'],
      [false, 'outside-press'],
      [false, 'close-press'],
    ]);
    expect(modal()).toBe(true);
  });

  test('controlled open that stays true: reported, stays modal', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled keepOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(reasons(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(modal()).toBe(true);
  });
});

describe('focus, inertness, scroll lock', () => {
  test('focus moves in on open and returns to the trigger on close', async () => {
    render(<TestDrawer />);
    await userEvent.click(q('trigger'));
    await raf();
    expect(dlg().contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(document.activeElement).toBe(q('trigger'));
  });

  test('Tab is trapped inside the drawer', async () => {
    render(<TestDrawer defaultOpen />);
    await raf();
    const seen = new Set<Element | null>();
    for (let i = 0; i < 8; i++) {
      await userEvent.tab();
      seen.add(document.activeElement);
    }
    expect(seen.has(q('before'))).toBe(false);
    expect(seen.has(q('after'))).toBe(false);
    expect(seen.has(q('trigger'))).toBe(false);
  });

  test('scroll lock: html overflow is hidden while open, restored after the exit', async () => {
    render(<TestDrawer />);
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
    await userEvent.click(q('trigger'));
    await raf();
    expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    await raf();
    await settled(dlg());
    expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
  });
});

describe('slide animation', () => {
  test('the element stays rendered and children mounted until the exit ends', async () => {
    render(<TestDrawer defaultOpen />);
    await raf();
    await settled(dlg());
    await userEvent.click(q('close'));
    await new Promise((r) => setTimeout(r, 40));
    expect(dlg().open).toBe(false);
    expect(getComputedStyle(dlg()).display).not.toBe('none');
    expect(q('input')).toBeTruthy();
    await new Promise((r) => setTimeout(r, 300));
    expect(getComputedStyle(dlg()).display).toBe('none');
    expect(q('input')).toBeNull();
  });

  test('the drawer slides: translated off its edge mid-exit, at rest when open', async () => {
    render(<TestDrawer defaultOpen />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right, edgeInfo(dlg())).toBeCloseTo(viewport().right, 0);
    await userEvent.keyboard('{Escape}');
    await new Promise((r) => setTimeout(r, 60));
    expect(dlg().getBoundingClientRect().left).toBeGreaterThan(
      viewport().right - dlg().offsetWidth,
    );
  });
});

describe('placement', () => {
  test('placement sets data-placement and the edge it docks to', async () => {
    const { unmount } = render(<TestDrawer defaultOpen popup={{ placement: 'bottom' }} />);
    await raf();
    await settled(dlg());
    expect(dlg().getAttribute('data-placement')).toBe('bottom');
    expect(dlg().getBoundingClientRect().bottom).toBeCloseTo(window.innerHeight, 0);
    unmount();
  });

  test('LTR: start docks left, end docks right', async () => {
    const start = render(<TestDrawer defaultOpen popup={{ placement: 'start' }} />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().left, edgeInfo(dlg())).toBeCloseTo(0, 0);
    start.unmount();
    render(<TestDrawer defaultOpen popup={{ placement: 'end' }} />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right, edgeInfo(dlg())).toBeCloseTo(viewport().right, 0);
  });

  test('RTL: start follows dir and docks right, end docks left', async () => {
    const start = render(<TestDrawer defaultOpen direction="rtl" popup={{ placement: 'start' }} />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().right, edgeInfo(dlg())).toBeCloseTo(viewport().right, 0);
    start.unmount();
    render(<TestDrawer defaultOpen direction="rtl" popup={{ placement: 'end' }} />);
    await raf();
    await settled(dlg());
    expect(dlg().getBoundingClientRect().left, edgeInfo(dlg())).toBeCloseTo(viewport().left, 0);
  });
});

describe('API surface', () => {
  test('native props and ref reach the <dialog>; Trigger merges onto a Button component', async () => {
    const ref = { current: null as HTMLDialogElement | null };
    render(
      <Drawer.Root>
        <Drawer.Trigger>
          <Button>Open</Button>
        </Drawer.Trigger>
        <Drawer.Popup ref={ref} id="d" className="mine" data-x="1" aria-label="Panel">
          <Drawer.Body>x</Drawer.Body>
        </Drawer.Popup>
      </Drawer.Root>,
    );
    expect(ref.current).toBe(dlg());
    expect(dlg().id).toBe('d');
    expect(dlg().classList.contains('mine')).toBe(true);
    expect(dlg().getAttribute('data-x')).toBe('1');
    await userEvent.click(document.querySelector('button')!);
    await raf();
    expect(modal()).toBe(true);
  });
});
