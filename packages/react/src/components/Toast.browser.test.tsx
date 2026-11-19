import { act, render } from '@testing-library/react';
import { I18nProvider } from 'react-aria-components';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { animating, finishAll, freezeAt, holdMotion, raf, settled } from '../test/browser';
import { createToaster, toast } from '../toast/imperativeToast';
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
    await expect.poll(region).toBeNull();
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
    await expect.poll(region).toBeNull();
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

describe('Toast placement and offset (#242)', () => {
  test('bottom-center centers the region horizontally', async () => {
    render(<Shell placement="bottom-center">{null}</Shell>);
    act(() => {
      toast.show({ title: 'Centered', durationMs: 0 });
    });
    await raf();
    const r = region()!.getBoundingClientRect();
    expect(Math.abs(r.left + r.width / 2 - window.innerWidth / 2)).toBeLessThanOrEqual(1);
    expect(Math.round(window.innerHeight - r.bottom)).toBe(0);
  });

  test('offset moves the region off its edges; className and style reach it', async () => {
    render(
      <Shell placement="bottom-end" offset={{ block: 64, inline: '1rem' }} className="mine">
        {null}
      </Shell>,
    );
    act(() => {
      toast.show({ title: 'Above the bar', durationMs: 0 });
    });
    await raf();
    const r = region()!.getBoundingClientRect();
    expect(Math.round(window.innerHeight - r.bottom)).toBe(64);
    expect(Math.round(window.innerWidth - r.right)).toBe(16);
    expect(region()!.classList.contains('mine')).toBe(true);
  });

  test('the offset custom property works from plain CSS too', async () => {
    const queue = new ToastQueue();
    render(
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <ToastRegion queue={queue} style={{ ['--var-ui-toast-offsetblock' as string]: '40px' }} />
        </IconProvider>
      </DesignSystemProvider>,
    );
    act(() => {
      queue.add({ title: 'CSS' });
    });
    await raf();
    expect(Math.round(window.innerHeight - region()!.getBoundingClientRect().bottom)).toBe(40);
  });

  test('createToaster targets an app-owned queue and region', async () => {
    const queue = new ToastQueue();
    const notify = createToaster(queue);
    render(
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <ToastRegion queue={queue} />
        </IconProvider>
      </DesignSystemProvider>,
    );
    let id = '';
    act(() => {
      id = notify({ title: 'Added to favorites', durationMs: 0 });
    });
    await raf();
    expect(text('Added to favorites')).toBeTruthy();
    act(() => notify.dismiss(id));
    await expect.poll(region).toBeNull();
  });

  test('ToastProvider takes an existing queue, and toast() reaches it', async () => {
    const queue = new ToastQueue();
    render(<Shell queue={queue}>{null}</Shell>);
    act(() => {
      toast.show({ title: 'Shared', durationMs: 0 });
    });
    await raf();
    expect(queue.visibleToasts.map((t) => t.content.title)).toEqual(['Shared']);
    act(() => queue.clear());
    await expect.poll(region).toBeNull();
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

describe('Toast region exit', () => {
  test('dismissing the last toast animates out, then removes the region', async () => {
    holdMotion();
    render(<Shell>{null}</Shell>);
    let id = '';
    act(() => {
      id = toast.show({ title: 'Last', durationMs: 0 });
    });
    await raf();
    const el = region()!;
    await finishAll(el);
    act(() => toast.dismiss(id));
    await animating(el);
    // Still mounted, no longer open, and fading rather than gone.
    expect(region()).toBe(el);
    expect(shown()).toBe(false);
    expect(text('Last')).toBeTruthy();
    expect(el.inert).toBe(true);
    freezeAt(el, 0.5);
    expect(Number(getComputedStyle(el).opacity)).toBeLessThan(1);
    expect(region()).toBe(el);
    await finishAll(el);
    await expect.poll(region).toBeNull();
  });

  test('dismissing while the region is still entering reverses into the exit', async () => {
    holdMotion();
    render(<Shell>{null}</Shell>);
    let id = '';
    act(() => {
      toast.show({ title: 'Other', durationMs: 0 });
      id = toast.show({ title: 'Entering', durationMs: 0 });
    });
    await raf();
    const el = region()!;
    await animating(el);
    freezeAt(el, 0.3);
    act(() => toast.dismiss(id));
    await raf();
    // Another toast remains: the region stays open and the dismissed toast is gone.
    expect(region()).toBe(el);
    expect(shown()).toBe(true);
    expect(text('Entering')).toBeUndefined();
    expect(text('Other')).toBeTruthy();
    const other = [...document.querySelectorAll('button[aria-label="Dismiss"]')];
    expect(other).toHaveLength(1);
    act(() => toast.dismissAll());
  });

  test('dismissing the only toast mid-enter still finishes the exit before unmounting', async () => {
    holdMotion();
    render(<Shell>{null}</Shell>);
    let id = '';
    act(() => {
      id = toast.show({ title: 'Quick', durationMs: 0 });
    });
    await raf();
    const el = region()!;
    await animating(el);
    freezeAt(el, 0.4);
    act(() => toast.dismiss(id));
    await animating(el);
    expect(region()).toBe(el);
    expect(shown()).toBe(false);
    await finishAll(el);
    await expect.poll(region).toBeNull();
  });

  test('a toast arriving during the last toast exit cancels the removal', async () => {
    holdMotion();
    render(<Shell>{null}</Shell>);
    let id = '';
    act(() => {
      id = toast.show({ title: 'Going', durationMs: 0 });
    });
    await raf();
    const el = region()!;
    await finishAll(el);
    act(() => toast.dismiss(id));
    await animating(el);
    expect(shown()).toBe(false);
    act(() => {
      toast.show({ title: 'Back', durationMs: 0 });
    });
    await raf();
    expect(region()).toBe(el);
    expect(shown()).toBe(true);
    expect(el.inert).toBe(false);
    expect(text('Back')).toBeTruthy();
    expect(text('Going')).toBeUndefined();
    await finishAll(el);
    await raf();
    expect(region()).toBe(el);
    expect(shown()).toBe(true);
  });
});
