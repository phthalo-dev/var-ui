import { act, render } from '@testing-library/react';
import { I18nProvider } from 'react-aria-components';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { raf, settled } from '../test/browser';
import { toast } from '../toast/imperativeToast';
import { Dialog } from './Dialog';
import { ToastProvider, ToastQueue, ToastRegion } from './Toast';

beforeAll(() => {
  const fast = document.createElement('style');
  fast.textContent = ':root, :root[class] { --var-ui-duration-slow: 120ms; }';
  document.head.append(fast);
});

afterEach(() => {
  document.documentElement.dir = '';
});

const region = () => document.querySelector<HTMLElement>('[popover]');
const text = (s: string) =>
  [...document.querySelectorAll('[role="alertdialog"], [role="status"], *')].find(
    (el) => el.children.length === 0 && el.textContent === s,
  );
const shown = () => region()?.matches(':popover-open') ?? false;

function Shell({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) {
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={{}}>
        <ToastProvider {...rest}>{children}</ToastProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}

describe('Toast region (native popover)', () => {
  test('appears in the top layer while toasts exist and leaves when the queue empties', async () => {
    render(<Shell>{null}</Shell>);
    expect(region()).toBeNull();
    let id = '';
    act(() => {
      id = toast.show({ title: 'Saved', durationMs: 0 });
    });
    await raf();
    expect(region()!.getAttribute('popover')).toBe('manual');
    expect(shown()).toBe(true);
    expect(getComputedStyle(region()!).zIndex).toBe('auto');
    act(() => toast.dismiss(id));
    await raf();
    expect(region()).toBeNull();
  });

  test('auto-dismisses after durationMs', async () => {
    render(<Shell>{null}</Shell>);
    act(() => {
      toast.show({ title: 'Brief', durationMs: 60 });
    });
    await raf();
    expect(text('Brief')).toBeTruthy();
    await expect.poll(() => text('Brief')).toBeUndefined();
    expect(region()).toBeNull();
  });

  test('the dismiss button closes the toast', async () => {
    render(<Shell>{null}</Shell>);
    act(() => {
      toast.show({ title: 'Closable', durationMs: 0 });
    });
    await raf();
    await userEvent.click(document.querySelector<HTMLElement>('button[aria-label="Dismiss"]')!);
    await expect.poll(() => text('Closable')).toBeUndefined();
    expect(region()).toBeNull();
  });

  test('maxVisibleToasts caps what is rendered; the rest queue behind', async () => {
    render(<Shell maxVisibleToasts={2}>{null}</Shell>);
    act(() => {
      toast.show({ title: 'A', durationMs: 0 });
      toast.show({ title: 'B', durationMs: 0 });
      toast.show({ title: 'C', durationMs: 0 });
    });
    await raf();
    expect(region()!.querySelectorAll('button[aria-label="Dismiss"]')).toHaveLength(2);
    act(() => toast.dismissAll());
    await raf();
    expect(region()).toBeNull();
  });

  test.each([
    ['top-end', { top: true, end: true }],
    ['top-start', { top: true, end: false }],
    ['bottom-end', { top: false, end: true }],
    ['bottom-start', { top: false, end: false }],
  ] as const)('placement %s anchors to its corner', async (placement, want) => {
    render(<Shell placement={placement}>{null}</Shell>);
    act(() => {
      toast.show({ title: 'P', durationMs: 0 });
    });
    await raf();
    const rect = region()!.getBoundingClientRect();
    if (want.top) expect(rect.top).toBeLessThan(window.innerHeight / 2);
    else expect(rect.bottom).toBeGreaterThan(window.innerHeight / 2);
    if (want.end) expect(rect.left).toBeGreaterThan(window.innerWidth / 2);
    else expect(rect.right).toBeLessThan(window.innerWidth / 2);
    act(() => toast.dismissAll());
  });

  test('end flips to the left in an RTL locale', async () => {
    document.documentElement.dir = 'rtl';
    const queue = new ToastQueue();
    render(
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <I18nProvider locale="ar-EG">
            <ToastRegion queue={queue} placement="bottom-end" />
          </I18nProvider>
        </IconProvider>
      </DesignSystemProvider>,
    );
    act(() => {
      queue.add({ title: 'RTL' });
    });
    await raf();
    expect(region()!.getBoundingClientRect().left).toBeLessThan(window.innerWidth / 2);
  });
});

describe('Toast above modal dialogs', () => {
  function Page({ open }: { open: boolean }) {
    return (
      <Shell>
        <Dialog.Root open={open}>
          <Dialog.Popup data-testid="dlg">
            <Dialog.Title>Modal</Dialog.Title>
            <Dialog.Description>Body</Dialog.Description>
          </Dialog.Popup>
        </Dialog.Root>
      </Shell>
    );
  }

  // The top layer has no ordering API (and an inert toast is skipped by hit-testing, so
  // `elementFromPoint` cannot tell "under" from "above but inert"). Re-promotion is observed as
  // the region closing and reopening: `beforetoggle` events `closed` then `open`.
  const recordToggles = (el: HTMLElement) => {
    const states: string[] = [];
    el.addEventListener('beforetoggle', (e) => states.push((e as ToggleEvent).newState));
    return states;
  };

  test('a toast shown after a modal opened is above it', async () => {
    render(<Page open />);
    await settled(document.querySelector('dialog')!);
    act(() => {
      toast.show({ title: 'After', durationMs: 0 });
    });
    await raf();
    expect(document.querySelector('dialog')!.matches(':modal')).toBe(true);
    expect(shown()).toBe(true);
    act(() => toast.dismissAll());
  });

  test('a toast shown before a modal opened is re-promoted above it', async () => {
    const view = render(<Page open={false} />);
    act(() => {
      toast.show({ title: 'Before', durationMs: 0 });
    });
    await raf();
    const states = recordToggles(region()!);
    view.rerender(<Page open />);
    await settled(document.querySelector('dialog')!);
    await raf();
    expect(document.querySelector('dialog')!.matches(':modal')).toBe(true);
    expect(shown()).toBe(true);
    expect(states).toEqual(['closed', 'open']);
    act(() => toast.dismissAll());
  });
});
